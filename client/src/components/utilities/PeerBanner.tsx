import { IUser } from "@/core/lib/types/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";

const PeerBanner = ({ peer }: { peer: IUser }) => {
  return (
    <div className="h-full w-full flex pl-8 items-center justify-start">
      <Avatar className="h-[4rem] w-[4rem]">
        <AvatarImage src={peer.image || ""} />
        <AvatarFallback>
          <Avvvatars value={peer.name || peer.username} size={65} />
        </AvatarFallback>
      </Avatar>
      <div className="h-full w-auto flex flex-col justify-center items-center">
        <p>{peer.name}</p>
        <p>{peer}</p>
      </div>
    </div>
  );
};

export default PeerBanner;
