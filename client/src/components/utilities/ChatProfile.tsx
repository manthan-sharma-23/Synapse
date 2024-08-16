import { IRoomDetails } from "@/core/lib/types/schema";
import PeerBanner from "./PeerBanner";
import GroupBanner from "./GroupBanner";

const ChatProfile = ({
  roomDetails,
  event = null,
}: {
  roomDetails: IRoomDetails;
  event?: string | null;
}) => {
  if (roomDetails.room.type === "peer") {
    return <PeerBanner peer={roomDetails.users[0]} event={event} />;
  }
  return <GroupBanner group={roomDetails} event={event} />;
};

export default ChatProfile;
