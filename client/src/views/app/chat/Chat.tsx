import NoChatWindow from "@/components/pages/NoChatWindow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatProfile from "@/components/utilities/ChatProfile";
import { useGetRoomDetails } from "@/core/hooks/useGetRoomDetails";
import { TbSend2 } from "react-icons/tb";
import { GoPaperclip } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatsDisplay from "@/components/utilities/ChatsDisplay";
import { RoomChats } from "@/core/lib/types/global.types";
import { ChatAtom } from "@/core/store/atom/chat.atom";
import { socket } from "@/socket";
import SelectImageOrVideo from "@/components/utilities/SelectImageOrVideo";
import { UserRoomsListAtom } from "@/core/store/atom/user-room.atom";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import { useGetUser } from "@/core/hooks/useGetUser";
import { IChatReadReceipt } from "@/core/lib/types/schema";

const Chat = () => {
  const { roomDetails, loading, roomId } = useGetRoomDetails();
  const { user } = useGetUser();
  const [event, setEvent] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [chatBox, setChatsInBox] = useRecoilState(ChatAtom);
  const setUserRooms = useSetRecoilState(UserRoomsListAtom);
  const user_select = useRecoilValue(UserSelector);

  useEffect(() => {
    setUserRooms((v) =>
      v.map((value) => {
        if (value.room.id === roomId) {
          if (value.new) {
            return { ...value, new: false };
          }
        }
        return value;
      })
    );

    if (user) {
      socket.emit("read:room", { roomId, userId: user.id });
    }

    socket.emit("join:room", { roomId });

    const handleTyping = (message: string) => {
      setEvent(message);
    };

    const handleStopTyping = () => {
      setEvent(null);
    };

    const handleMessage = (data: RoomChats) => {
      const chat = data;
      if (!chatBox.includes(chat)) {
        setChatsInBox((v) => [...v, chat]);
        console.log(chat);
        console.log(user);

        if (user && user.id !== chat.users.id) {
          socket.emit("read:message", {
            userId: user_select?.id,
            roomId,
            chatId: chat.chats.id,
          });
        }
      }
    };

    const handleReadMessage = (data: {
      chatId: string;
      roomId: string;
      userId: string;
      receipt: IChatReadReceipt;
    }) => {
      if (data.receipt.id) {
        setChatsInBox((v) =>
          v.map((chat) => {
            if (chat.chats.id === data.chatId) {
              const receipts = chat.receipts.map((receipt) => {
                if (receipt.userId === data.userId) {
                  return data.receipt;
                }

                return receipt;
              });

              return { ...chat, receipts };
            }
            return chat;
          })
        );
      }
    };

    const handleReadUserRoom = (data: { userId: string; roomId: string }) => {
      if (data.userId && data.roomId) {
        setChatsInBox((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.chats.roomId === data.roomId) {
              const updatedReceipts = chat.receipts.map((receipt) => {
                if (
                  receipt.userId === data.userId &&
                  receipt.status === "delivered"
                ) {
                  return {
                    ...receipt,
                    status: "read" as IChatReadReceipt["status"],
                    readAt: new Date(),
                  };
                }
                return receipt;
              });

              return {
                ...chat,
                receipts: updatedReceipts,
              };
            }
            return chat;
          });
        });
      }
    };

    socket.on("user:typing", handleTyping);
    socket.on("user:stop-typing", handleStopTyping);
    socket.on("user:message", handleMessage);
    socket.on("read:user-message", handleReadMessage);
    socket.on("read:user-room", handleReadUserRoom);

    return () => {
      socket.emit("event:user-leave-room", { roomId });
      socket.off("user:typing", handleTyping);
      socket.off("user:stop-typing", handleStopTyping);
      socket.off("user:message", handleMessage);
      socket.off("read:user-message", handleReadMessage);
    };
  }, [roomId, user]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | null = null;

    if (text.trim() !== "") {
      socket.emit("event:typing", { roomId, user: user });

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      typingTimeout = setTimeout(() => {
        socket.emit("event:stop-typing", { roomId, user: user });
      }, 3000);
    } else {
      socket.emit("event:stop-typing", { roomId, user: user });
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [text, user, roomId]);

  if (!roomDetails) {
    return <NoChatWindow />;
  }

  if (loading) {
    return <div>Loading..</div>;
  }

  const sendChatToRoom = () => {
    if (text.length <= 0) {
      return;
    }
    const message = {
      text,
      type: "text",
    };

    socket?.emit("event:message", { message, roomId, user });

    setText("");
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendChatToRoom();
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center">
      <Card className="w-full h-[10%] rounded-none bg-shade border-none">
        {roomDetails && <ChatProfile roomDetails={roomDetails} event={event} />}
      </Card>
      <div className="w-full h-[80%] rounded-none bg-white">
        <ChatsDisplay type={roomDetails.room.type} />
      </div>
      <div className="relative w-full h-[10%] rounded-none border-t flex justify-center items-center px-8 py-6">
        <div className="relative h-[6vh] w-full bg-shade flex rounded-md border border-gray-400 pr-6">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => onPressEnter(e)}
            className="bg-shade border-none h-full text-lg placeholder:text-lg placeholder:font-medium placeholder:text-gray-500 pl-4 pr-12"
            placeholder="Type your message here"
          />
          <div className="h-full w-[7rem] flex items-center justify-around text-2xl">
            <Dialog>
              <DialogTrigger>
                <GoPaperclip className="text-orange-600 cursor-pointer h-6 w-6 " />
              </DialogTrigger>
              <DialogContent>
                <SelectImageOrVideo />
              </DialogContent>
            </Dialog>
            <TbSend2
              onClick={sendChatToRoom}
              className="text-red-500 cursor-pointer rounded-md bg-orange-200/40 h-9 w-9 p-[4px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
