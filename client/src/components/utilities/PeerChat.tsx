import { RoomChats } from "@/core/lib/types/global.types";
import { IChat, IChatReadReceipt, IUser } from "@/core/lib/types/schema";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import "@/styles/scroll-bar.css";
import { useEffect, useRef } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MessageInfo from "./MessageInfo";

const PeerChat = ({ chats }: { chats: RoomChats[] }) => {
  const user = useRecoilValue(UserSelector);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div
      ref={chatContainerRef}
      className="h-full w-full overflow-y-scroll px-5 space-y-1.5 custom-scrollbar"
    >
      {user &&
        chats.map(({ users: chatUser, chats: chat, receipts }) => {
          return (
            <ChatBox
              key={chat.id}
              user={chatUser}
              chat={chat}
              mainUserId={user.id}
              receipts={receipts}
            />
          );
        })}
    </div>
  );
};

const ChatBox = ({
  chat,
  user,
  mainUserId,
  receipts,
}: {
  chat: IChat;
  user: IUser;
  mainUserId: string;
  receipts: IChatReadReceipt[];
}) => {
  const isMainUser = user.id === mainUserId;

  const isRead = receipts.every((receipt) => receipt.status === "read");
  const tickColor = isRead ? "text-yellow-400" : "text-white";

  return (
    <div
      className={twMerge(
        "w-full flex",
        isMainUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={twMerge(
          "max-w-[75%] px-5 py-3.5 rounded-lg",
          isMainUser
            ? "bg-red-500 text-white rounded-tr-md"
            : "bg-gray-200 text-black rounded-tl-md"
        )}
      >
        {chat.type === "text" && <p className="text">{chat.text}</p>}
        {chat.type === "image" && (
          <img
            src={chat.url}
            alt="Shared content"
            className="rounded-lg h-[25vh] w-[20vw]"
          />
        )}
        {chat.type === "video" && (
          <video controls className="rounded-lg h-[30vh]">
            <source src={chat.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div className="flex w-full justify-end items-center gap-3">
          <p
            className={twMerge(
              "text-[13px] mt-1.5",
              isMainUser ? "text-white/70" : "text-black/50"
            )}
          >
            {moment(chat.createdAt).format("LT")}
          </p>
          {isMainUser && (
            <Dialog>
              <DialogTrigger className="m-0 p-0 h-auto w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={twMerge(
                          "flex items-center justify-center mt-1.5",
                          tickColor
                        )}
                      >
                        <IoCheckmarkDoneOutline
                          className={twMerge(
                            "text-white text-lg ml-2",
                            tickColor
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Message Info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent>
                <MessageInfo chat={chat} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerChat;
