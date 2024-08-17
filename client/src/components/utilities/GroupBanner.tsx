import { IRoomDetails } from "@/core/lib/types/schema";
import { Avatar } from "../ui/avatar";
import Avvvatars from "avvvatars-react";

import InviteUserToGroup from "./InviteUserToGroup";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import RoomExpandedDetails from "./RoomExpandedDetails";
import Conference from "@/views/app/conference/conference";

const GroupBanner = ({
  group,
  event = null,
}: {
  group: IRoomDetails;
  event?: string | null;
}) => {
  return (
    <div className="flex justify-between px-8 items-center h-full">
      <div className="h-full w-full flex  items-center justify-start gap-4">
        <Dialog>
          <DialogTrigger className="h-full">
            <Avatar className="h-[4rem] w-[4rem]  hover:bg-orange-100 transition-all cursor-pointer flex justify-center items-center">
              <Avvvatars
                value={group.room.name || group.room.id}
                style="shape"
                size={55}
              />
            </Avatar>
          </DialogTrigger>
          <DialogContent>
            <RoomExpandedDetails />
          </DialogContent>
        </Dialog>
        <div className="h-full w-auto flex flex-col gap-1 justify-center items-start">
          <div className="font-poppins flex items-end justify-start h-auto gap-3">
            <p className="text-black font-semibold text-xl">
              {group.room.name}
            </p>
          </div>
          <div className="text-sm text-black/55 font-semibold">
            {event ? (
              <Badge variant="outline">{event}</Badge>
            ) : (
              <Badge variant="default">{group.count} Member(s)</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center">
        <Conference />
        <InviteUserToGroup />
      </div>
    </div>
  );
};

export default GroupBanner;
