import {
  BundledChat,
  bundleMessagesByUser,
} from "@/core/lib/helper/bundle-group-chats";
import { RoomChats } from "@/core/lib/types/global.types";
import { IChat } from "@/core/lib/types/schema";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import "@/styles/scroll-bar.css";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import { useEffect, useRef } from "react";


const GroupChat = ({ chats }: { chats: RoomChats[] }) => {
  const messages = bundleMessagesByUser(chats);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // adds smooth scrolling
      });
    }
  }, [chats]);

  return (
    <div
      ref={chatContainerRef}
      className="h-full w-full overflow-y-scroll px-4 custom-scrollbar space-y-4 py-1"
    >
      {messages &&
        messages.map((message, index) => (
          <MessageBundleBox key={index} message={message} />
        ))}
    </div>
  );
};

const MessageBundleBox = ({ message }: { message: BundledChat }) => {
  const user = useRecoilValue(UserSelector);

  if (!user) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "w-full h-auto flex items-start",
        message.user.id === user.id ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={twMerge(
          "flex items-start space-x-3",
          message.user.id === user.id ? "flex-row-reverse space-x-reverse" : ""
        )}
      >
        {/* User Avatar */}
        <Avatar className="h-[2.5rem] w-[2.5rem]">
          <AvatarImage src={message.user.image || ""} />
          <AvatarFallback>
            <Avvvatars
              value={message.user.name || message.user.username}
              size={45}
            />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          {/* User Name
          <span className="text-sm font-semibold border ">
            {message.user.name?.split(" ")[0] || message.user.username}
          </span> */}

          {/* Message Box */}
          {message.messages &&
            message.messages.map((chat) => (
              <MessageBox
                key={chat.id}
                chat={chat}
                isOwnMessage={message.user.id === user.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const MessageBox = ({
  chat,
  isOwnMessage,
}: {
  chat: IChat;
  isOwnMessage: boolean;
}) => {
  return (
    <div
      className={twMerge(
        "max-w-xs p-3 rounded-lg text-sm",
        isOwnMessage
          ? "bg-red-500 text-white self-end"
          : "bg-gray-200 text-gray-800 self-start"
      )}
    >
      {chat.type === "text" && <p className="pr-5">{chat.text}</p>}
      {chat.type === "image" && (
        <img src={chat.url} alt="Shared content" className="rounded-lg" />
      )}
      {chat.type === "video" && (
        <video controls className="rounded-lg">
          <source src={chat.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <span
        className={twMerge(
          "text-xs mt-1 text-white w-full flex items-center",
          isOwnMessage ? "justify-end " : "justify-start text-gray-700"
        )}
      >
        {moment(chat.createdAt).format("LT")}
      </span>
    </div>
  );
};

export default GroupChat;
