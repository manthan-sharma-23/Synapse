import { RoomExpandedDetails } from "@/core/lib/types/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { IChat } from "@/core/lib/types/schema";
import { ScrollArea } from "../ui/scroll-area";

const GroupDetails = ({ details }: { details: RoomExpandedDetails }) => {
  return (
    <div className="h-[85vh] w-full flex flex-col items-start justify-center gap-2">
      <div className="h-[20vh] w-full flex flex-col justify-center items-center gap-2">
        <Avatar className="h-[5rem] w-[5rem]">
          <Avvvatars value={details.room.name || ""} style="shape" size={80} />
        </Avatar>
        <p className="text-xl font-semibold">{details.room.name}</p>
        <Badge>{moment(details.room.createdAt).format("LL")}</Badge>
      </div>
      <div className="h-[65vh] w-full">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-1/2" value="members">
              Members
            </TabsTrigger>
            <TabsTrigger className="w-1/2" value="media">
              Media
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <GroupMembers members={details.users} />
          </TabsContent>
          <TabsContent value="media">
            <MediaList media={details.media} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const GroupMembers = ({
  members,
}: {
  members: RoomExpandedDetails["users"];
}) => {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {members &&
            members.map((user) => (
              <CommandItem
                key={user.id}
                value={user.username}
                className="flex justify-between items-center my-1"
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
                    {user.status ? (
                      <div className="flex justify-start items-center gap-1">
                        <p className="bg-green-500 h-3 w-3 rounded-full" />
                        <p>Online</p>
                      </div>
                    ) : (
                      <p className="text-gray-600/70 font-medium ">
                        Last seen {moment(user.lastLoggedIn).fromNow()}
                      </p>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
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

export default GroupDetails;
