import { RoomExpandedDetails } from "@/core/lib/types/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IChat } from "@/core/lib/types/schema";
import { ScrollArea } from "../ui/scroll-area";
import { useRecoilValue } from "recoil";
import { UserSelector } from "@/core/store/selectors/user.selectors";

const PeerDetails = ({ details }: { details: RoomExpandedDetails }) => {
  const user_log = useRecoilValue(UserSelector);

  const user = details.users.find((user) => user.id !== user_log!.id);

  if (!user) {
    return;
  }
  return (
    <div className="h-[85vh] w-full flex flex-col items-start justify-center gap-2">
      <div className="h-[20vh] w-full flex flex-col justify-center items-center gap-2">
        <Avatar className="h-[5rem]  w-[5rem]">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>
            <Avvvatars value={user.name || user.username} size={80} />
          </AvatarFallback>
        </Avatar>
        <p className="text-xl font-semibold">{user.name}</p>
        <Badge>
          {user.status ? (
            <div className="flex gap-1 items-center text-[.9rem]">
              <p className="bg-green-500 h-3 w-3 rounded-full" />
              Online
            </div>
          ) : (
            moment(details.room.createdAt).format("LL")
          )}
        </Badge>
      </div>
      <div className="h-[65vh] w-full">
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="media">
              Media
            </TabsTrigger>
          </TabsList>
          <TabsContent value="media">
            <MediaList media={details.media} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const MediaList = ({ media }: { media: IChat[] }) => {
  return (
    <ScrollArea className="w-full h-full p-2">
      <div className="grid grid-cols-3 gap-2">
        {media.map((chat) => (
          <div
            key={chat.id}
            className="relative w-full h-24 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg"
          >
            {chat.type === "image" && chat.url && (
              <img
                src={chat.url}
                alt="Media"
                className="w-full h-full object-cover"
              />
            )}
            {chat.type === "video" && chat.url && (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  src={chat.url}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute text-white text-xl">▶</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PeerDetails;
