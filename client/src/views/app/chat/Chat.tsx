import { Card } from "@/components/ui/card";
import ChatProfile from "@/components/utilities/ChatProfile";
import { useGetRoomDetails } from "@/core/hooks/useGetRoomDetails";

const Chat = () => {
  const { roomDetails, loading } = useGetRoomDetails();

  if (loading) {
    return <div>loading..</div>;
  }
  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center">
      <Card className="w-full h-[10%] rounded-none bg-shade border-none">
        {roomDetails && <ChatProfile roomDetails={roomDetails} />}
      </Card>
      <div className="w-full h-[80%] rounded-none bg-white"></div>
      <div className="w-full h-[10%] rounded-none bg-shade"></div>
    </div>
  );
};

export default Chat;
