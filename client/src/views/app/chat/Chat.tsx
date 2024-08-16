import NoChatWindow from "@/components/pages/NoChatWindow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatProfile from "@/components/utilities/ChatProfile";
import { useGetRoomDetails } from "@/core/hooks/useGetRoomDetails";
import { TbSend2 } from "react-icons/tb";
import { GoPaperclip } from "react-icons/go";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { UserAtom } from "@/core/store/atom/user.atom";
import { Socket } from "socket.io-client";

const Chat = ({ socket }: { socket: Socket }) => {
  const { roomDetails, loading, roomId } = useGetRoomDetails();
  const user = useRecoilValue(UserAtom);
  const [event] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("user:typing", (data) => {
        console.log(data);
      });

      socket.on("user:message", (data) => {
        console.log(data);
      });
    }
  }, []);

  useEffect(() => {
    if (roomId && socket) {
      socket.emit("join:room", { roomId });
    } else {
      console.log("NO socket");
    }
  }, [roomId, user]);

  if (!roomDetails) {
    return <NoChatWindow />;
  }

  if (loading) {
    return <div>Loading..</div>;
  }

  const sendChatToRoom = () => {
    const message = {
      text,
      type: "text",
    };

    socket?.emit("event:message", { message, roomId, user });
  };

  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center">
      <Card className="w-full h-[10%] rounded-none bg-shade border-none">
        {roomDetails && <ChatProfile roomDetails={roomDetails} event={event} />}
      </Card>
      <div className="w-full h-[80%] rounded-none bg-white"></div>
      <div className="relative w-full h-[10%] rounded-none border-t flex justify-center items-center px-8 py-6">
        <div className="relative h-[6vh] w-full bg-shade flex rounded-md border border-gray-400 pr-6">
          <Input
            onChange={(e) => setText(e.target.value)}
            // onKeyDown={(e)=>{e.key}}
            className="bg-shade border-none h-full text-lg placeholder:text-lg placeholder:font-medium placeholder:text-gray-500 pl-4 pr-12"
            placeholder="Type your message here"
          />
          <div className="h-full w-[7rem] flex items-center justify-around text-2xl">
            <GoPaperclip className="text-orange-600 cursor-pointer h-6 w-6 " />
            <TbSend2
              onClick={sendChatToRoom}
              className="text-orange-600 cursor-pointer rounded-md bg-orange-200/60 h-10 w-10 p-[4px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
