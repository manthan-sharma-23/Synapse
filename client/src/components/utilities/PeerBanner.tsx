import { IUser } from "@/core/lib/types/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";

const PeerBanner = ({
  peer,
  event = null,
}: {
  peer: IUser;
  event?: string | null;
}) => {
  console.log(peer);

  return (
    <div className="h-full w-full flex pl-8 items-center justify-start gap-4">
      <Avatar className="h-[4rem] w-[4rem]">
        <AvatarImage src={peer.image || ""} />
        <AvatarFallback>
          <Avvvatars value={peer.name || peer.username} size={65} />
        </AvatarFallback>
      </Avatar>
      <div className="h-full w-auto flex flex-col gap-1 justify-center items-start">
        <div className="font-poppins flex items-end justify-start h-auto gap-3">
          <p className="text-black font-medium text-lg">{peer.name}</p>
          <p className="font-mono text-gray-600/80 font-semibold text-sm">
            @{peer.username}
          </p>
        </div>
        <div className="text-sm text-black/55 font-medium">
          {event ? (
            <p>{event}</p>
          ) : (
            <div>
              {peer.status ? (
                <div className="flex items-center justify-start gap-1">
                  <p className="bg-green-500 h-3 w-3 rounded-full" />
                  Online
                </div>
              ) : (
                <p>Last seen {moment(peer.lastLoggedIn).fromNow()}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerBanner;
