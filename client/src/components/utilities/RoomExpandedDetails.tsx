import { useGetExpandedRoomDetails } from "@/core/hooks/useGetExpandedRoomDetails";
import LoadingPage from "../pages/LoadingPage";
import GroupDetails from "./GroupDetails";
import PeerDetails from "./PeerDetails";

const RoomExpandedDetails = () => {
  const { data, isLoading } = useGetExpandedRoomDetails();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>No room details found</div>;
  }

  if (data?.room.type === "group") {
    return <GroupDetails details={data} />;
  }
  return <PeerDetails details={data} />;
};

export default RoomExpandedDetails;
