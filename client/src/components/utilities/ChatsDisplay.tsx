import { useGetRoomChats } from "@/core/hooks/useGetRoomChats";
import NoConversationWindow from "../pages/NoConversationWindow";
import LoadingPage from "../pages/LoadingPage";
import PeerChat from "./PeerChat";
import GroupChat from "./GroupChat";

const ChatsDisplay = ({ type }: { type: "peer" | "group" }) => {
  const { chats, loading } = useGetRoomChats();

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
      {type === "peer" ? (
        <PeerChat chats={chats} />
      ) : (
        <GroupChat chats={chats} />
      )}
    </div>
  );
};

export default ChatsDisplay;
