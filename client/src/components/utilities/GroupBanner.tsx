import { IRoomDetails } from "@/core/lib/types/schema";
import { Avatar } from "../ui/avatar";
import Avvvatars from "avvvatars-react";

import InviteUserToGroup from "./InviteUserToGroup";

const GroupBanner = ({
  group,
  event = null,
}: {
  group: IRoomDetails;
  event?: string | null;
}) => {
  console.log(group);

  return (
    <div className="flex justify-between px-8 items-center h-full">
      <div className="h-full w-full flex  items-center justify-start gap-4">
        <Avatar className="h-[4rem] w-[4rem]">
          <Avvvatars value={group.room.name || group.room.id} size={65} />
        </Avatar>
        <div className="h-full w-auto flex flex-col gap-1 justify-center items-start">
          <div className="font-poppins flex items-end justify-start h-auto gap-3">
            <p className="text-black font-bold text-2xl">{group.room.name}</p>
          </div>
          <div className="text-sm text-black/55 font-medium">
            {event ? <p>{event}</p> : <div></div>}
          </div>
        </div>
      </div>
      <div>
        <InviteUserToGroup />
      </div>
    </div>
  );
};

export default GroupBanner;
