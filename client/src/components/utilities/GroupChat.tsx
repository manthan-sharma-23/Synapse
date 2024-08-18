import {
  BundledChat,
  bundleMessagesByUser,
} from "@/core/lib/helper/bundle-group-chats";
import { RoomChats } from "@/core/lib/types/global.types";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import "@/styles/scroll-bar.css";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import { useEffect, useRef } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const GroupChat = ({ chats }: { chats: RoomChats[] }) => {
  const messages = bundleMessagesByUser(chats);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  console.log("CHATS", messages);

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
                key={chat.chat.id}
                chat={chat}
                isOwnMessage={message.user.id === user.id}
                // reciept={message.}
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
  chat: BundledChat["messages"][0];
  isOwnMessage: boolean;
}) => {
  const isRead = chat.receipts.every((receipt) => receipt.status === "read");
  const tickColor = isRead ? "text-green-400" : "text-white";

  console.log("GROUP reciepts", chat.receipts);

  return (
    <div
      className={twMerge(
        "max-w-xs p-3 rounded-lg text-sm relative",
        isOwnMessage
          ? "bg-red-500 text-white self-end"
          : "bg-gray-200 text-gray-800 self-start"
      )}
    >
      {chat.chat.type === "text" && (
        <p className="pr-5 text-lg">{chat.chat.text}</p>
      )}
      {chat.chat.type === "image" && (
        <img src={chat.chat.url} alt="Shared content" className="rounded-lg" />
      )}
      {chat.chat.type === "video" && (
        <video controls className="rounded-lg">
          <source src={chat.chat.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="flex items-center justify-between mt-1">
        <span
          className={twMerge(
            "text-xs text-white",
            isOwnMessage ? "text-white" : "text-gray-700"
          )}
        >
          {moment(chat.chat.createdAt).format("LT")}
        </span>
        {isOwnMessage && (
          <IoCheckmarkDoneOutline
            className={twMerge("text-white text-lg ml-2", tickColor)}
          />
        )}
      </div>
    </div>
  );
};

export default GroupChat;
