import useGetMessageInfo from "@/core/hooks/useGetMessageInfo";
import { IChat } from "@/core/lib/types/schema";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";

const MessageInfo = ({ chat }: { chat: IChat }) => {
  const { info } = useGetMessageInfo({ chatId: chat.id });
  return (
    <div className="min-h-[60vh] w-full overflow-hidden flex flex-col justify-center items-center">
      <div className="min-h-1/3 w-full p-7 bg-red-500 rounded-xl ">
        {chat.type === "text" && (
          <div>
            <p className="pr-5 text-lg text-white">{chat.text}</p>
          </div>
        )}
        {chat.type === "image" && (
          <img src={chat.url} alt="Shared content" className="rounded-lg" />
        )}
        {chat.type === "video" && (
          <video controls className="rounded-lg">
            <source src={chat.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="h-2/3 w-full  font-poppins mt-5">
        <p className="text-xl">Read by</p>
        <ScrollArea className="mt-4">
          {info &&
            info.map((user) => (
              <div
                key={user.username}
                className="flex justify-between items-center my-3"
              >
                <div className="flex justify-start h-full items-center gap-3">
                  <Avatar className="h-[3rem] w-[3rem]">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      <Avvvatars value={user.name || user.username} size={45} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex gap-4 items-center font-medium font-poppins">
                      {user.name && <p>{user.name}</p>}
                      <p>@{user.username}</p>
                      {user.status && <p className="bg-green-500" />}
                    </div>
                    <div className="text-sm font-medium text-gray-600">at {moment(user.readAt).format("lll")}</div>
                  </div>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MessageInfo;
