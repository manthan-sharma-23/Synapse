import { RoomChats } from "@/core/lib/types/global.types";
import { IChat, IUser } from "@/core/lib/types/schema";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import "@/styles/scroll-bar.css";
import { useEffect, useRef } from "react";

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
        chats.map(({ users: chatUser, chats: chat }) => {
          return (
            <ChatBox
              key={chat.id}
              user={chatUser}
              chat={chat}
              mainUserId={user.id}
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
}: {
  chat: IChat;
  user: IUser;
  mainUserId: string;
}) => {
  const isMainUser = user.id === mainUserId;

  return (
    <div
      className={twMerge(
        "w-full flex",
        isMainUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={twMerge(
          "max-w-[75%] px-5 py-3.5 rounded-lg ",
          isMainUser
            ? "bg-red-500 text-white rounded-tr-md"
            : "bg-gray-200 text-black rounded-tl-md"
        )}
      >
        <p className="text">{chat.text}</p>
        <p
          className={twMerge(
            "text-[13px] mt-1.5",
            isMainUser ? "text-white/70" : "text-black/50"
          )}
        >
          {moment(chat.createdAt).format("LT")}
        </p>
      </div>
    </div>
  );
};

export default PeerChat;
