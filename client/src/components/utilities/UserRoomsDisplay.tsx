import { useGetUserRooms } from "@/core/hooks/useGetUserRooms";
import "@/styles/scroll-bar.css";
import LoadingPage from "../pages/LoadingPage";
import { UserRoomList } from "@/core/lib/types/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { FaFileImage } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { useEffect } from "react";
import { socket } from "@/socket";

const UserRoomsDisplay = () => {
  const { userRooms, loading, setUserRooms } = useGetUserRooms();

  useEffect(() => {
    socket.on("block:update", (data: UserRoomList) => {
      setUserRooms((v) =>
        v.map((value) => {
          if (value.room.id === data.room.id) {
            return { ...value, chat: data.chat, new: true };
          }
          return value;
        })
      );
    });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-full w-full overflow-y-scroll custom-scrollbar border-y ">
      {userRooms &&
        userRooms.map((userRoom) => (
          <UserRoomBox key={userRoom.room.id} userRoom={userRoom} />
        ))}
    </div>
  );
};

const UserRoomBox = ({ userRoom }: { userRoom: UserRoomList }) => {
  if (userRoom.room.type === "peer") {
    return <UserPeerBox userRoom={userRoom} />;
  }
  return <UserGroupBox userRoom={userRoom} />;
};

const UserPeerBox = ({ userRoom }: { userRoom: UserRoomList }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  if (!userRoom.member) {
    return;
  }
  return (
    <div
      onClick={() => {
        const params = new URLSearchParams({ roomId: userRoom.room.id });

        navigate(`/?${params}`);
      }}
      className={twMerge(
        "flex px-6  py-5 border-b items-center justify-start gap-5 cursor-pointer hover:bg-shade",
        userRoom.room.id === roomId && "bg-shade"
      )}
    >
      <Avatar className="h-[3rem] w-[3rem]">
        <AvatarImage src={userRoom.member.image || ""} />
        <AvatarFallback>
          <Avvvatars
            value={userRoom.member.name || userRoom.member.username}
            size={50}
          />
        </AvatarFallback>
      </Avatar>
      <div className="h-full w-full flex flex-col items-start justify-center">
        <div className="flex gap-2 items-center justify-start">
          <p className="text-lg font-medium">
            {userRoom.member.name || userRoom.member.username}
          </p>
          {userRoom.chat && (
            <p className="text-sm text-gray-500 font-medium">
              {moment(userRoom.chat.createdAt).fromNow()}
            </p>
          )}
        </div>
        <div className="w-full pr-6 flex justify-between items-center">
          {userRoom.chat &&
            userRoom.chat.text &&
            userRoom.chat.type === "text" && (
              <p>
                {userRoom.chat.text.length < 50
                  ? userRoom.chat.text
                  : userRoom.chat.text.slice(0, 51) + ".."}
              </p>
            )}
          {userRoom.chat && userRoom.chat.type === "image" && (
            <div className="flex gap-1 justify-start items-center text-gray-700">
              <FaFileImage />
              Image
            </div>
          )}
          {userRoom.chat && userRoom.chat.type === "video" && (
            <div className="flex gap-1 justify-start items-center text-gray-700">
              <FaFileVideo />
              Video
            </div>
          )}
          {userRoom.new && <p className="bg-green-500 h-4 w-4 rounded-full" />}
        </div>
      </div>
    </div>
  );
};

const UserGroupBox = ({ userRoom }: { userRoom: UserRoomList }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  return (
    <div
      onClick={() => {
        const params = new URLSearchParams({ roomId: userRoom.room.id });
        navigate(`/?${params}`);
      }}
      className={twMerge(
        "flex px-6  py-5 border-b items-center justify-start gap-5 cursor-pointer hover:bg-shade",
        userRoom.room.id === roomId && "bg-shade"
      )}
    >
      <Avatar className="h-[3rem] w-[3rem]">
        <Avvvatars
          value={userRoom.room.name || userRoom.room.id}
          style="shape"
          size={50}
        />
      </Avatar>
      <div className="h-full w-full flex flex-col items-start justify-center">
        <div className="flex gap-2 items-center justify-start">
          <p className="text-lg font-medium">
            {userRoom.room.name || userRoom.room.id}
          </p>
          {userRoom.chat && (
            <p className="text-sm text-gray-500 font-medium">
              {moment(userRoom.chat.createdAt).fromNow()}
            </p>
          )}
        </div>
        <div className="w-full pr-6 flex justify-between items-center">
          {userRoom.chat && userRoom.chat.type === "text" && (
            <p>{userRoom.chat.text}</p>
          )}
          {userRoom.chat && userRoom.chat.type === "image" && (
            <div className="flex gap-1 justify-start items-center text-gray-700">
              <FaFileImage />
              Image
            </div>
          )}
          {userRoom.chat && userRoom.chat.type === "video" && (
            <div className="flex gap-1 justify-start items-center text-gray-700">
              <FaFileVideo />
              Video
            </div>
          )}
          {userRoom.new && <p className="bg-green-500 h-4 w-4 rounded-full" />}
        </div>
      </div>
    </div>
  );
};

export default UserRoomsDisplay;
