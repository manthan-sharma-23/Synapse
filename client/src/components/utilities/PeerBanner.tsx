import { IUser } from "@/core/lib/types/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RoomExpandedDetails from "./RoomExpandedDetails";

const PeerBanner = ({
  peer,
  event = null,
}: {
  peer: IUser;
  event?: string | null;
}) => {
  return (
    <div className="h-full w-full flex pl-8 items-center justify-start gap-4">
      <Dialog>
        <DialogTrigger className="h-full flex items-center p-0">
          <Avatar className=" p-0 h-[4rem] hover:bg-orange-200 w-[4rem] cursor-pointer  transition-all">
            <AvatarImage src={peer.image || ""} />
            <AvatarFallback>
              <Avvvatars value={peer.name || peer.username} size={50} />
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent>
          <RoomExpandedDetails />
        </DialogContent>
      </Dialog>
      <div className="h-full w-auto flex flex-col gap-1 justify-center items-start">
        <div className="font-poppins flex items-end justify-start h-auto gap-3">
          <p className="text-black font-medium text-lg">{peer.name}</p>
          <p className="font-mono text-gray-600/80 font-semibold text-sm">
            @{peer.username}
          </p>
        </div>
        <div className="text-sm text-black/55 font-medium">
          {event ? (
            <Badge variant="outline">{event}</Badge>
          ) : (
            <Badge variant="default">
              {peer.status ? (
                <div className="flex items-center justify-start gap-1">
                  <p className="bg-green-500 h-3 w-3 rounded-full" />
                  Online
                </div>
              ) : (
                <p>Last seen {moment(peer.lastLoggedIn).fromNow()}</p>
              )}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerBanner;
