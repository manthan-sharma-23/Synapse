import { IRoomDetails } from "@/core/lib/types/schema";
import PeerBanner from "./PeerBanner";
import GroupBanner from "./GroupBanner";

const ChatProfile = ({ roomDetails }: { roomDetails: IRoomDetails }) => {
  if (roomDetails.room.type === "peer") {
    return <PeerBanner peer={roomDetails.users[0]} />;
  }
  return <GroupBanner group={roomDetails} />;
};

export default ChatProfile;
