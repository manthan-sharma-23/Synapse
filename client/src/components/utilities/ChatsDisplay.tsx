import { useGetRoomChats } from "@/core/hooks/useGetRoomChats";
import NoConversationWindow from "../pages/NoConversationWindow";
import LoadingPage from "../pages/LoadingPage";
import PeerChat from "./PeerChat";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { socket } from "@/socket";

const ChatsDisplay = ({ type }: { type: "peer" | "group" }) => {
  const { chats, loading } = useGetRoomChats();
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  useEffect(() => {
    return () => {
      socket?.emit("event:user-leave-room", { roomId });
    };
  }, [params, roomId]);

  if (!chats) {
    return <div>Error</div>;
  }

  if (chats.length <= 0) {
    return <NoConversationWindow />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-full w-full flex justify-center items-center overflow-hidden p-1">
      {type === "peer" ? <PeerChat chats={chats} /> : <div></div>}
    </div>
  );
};

export default ChatsDisplay;
