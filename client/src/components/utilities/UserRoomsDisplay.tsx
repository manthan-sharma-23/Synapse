import { useGetUserRooms } from "@/core/hooks/useGetUserRooms";
import "@/styles/scroll-bar.css";
import LoadingPage from "../pages/LoadingPage";
import { UserRoomList } from "@/core/lib/types/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const UserRoomsDisplay = () => {
  const { userRooms, loading } = useGetUserRooms();

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
      <div className="h-full w-auto flex flex-col items-start justify-center">
        <div className="flex gap-2 items-center justify-start">
          <p className="text-lg font-medium">
            {userRoom.member.name || userRoom.member.username}
          </p>
          <p className="text-sm text-gray-500 font-medium">
            {moment(userRoom.chat.createdAt).fromNow()}
          </p>
        </div>
        <p>{userRoom.chat.text}</p>
      </div>
    </div>
  );
};

const UserGroupBox = ({ userRoom }: { userRoom: UserRoomList }) => {
  return (
    <div className="flex px-6 py-4">
      <Avatar className="h-[3rem] w-[3rem]">
        <Avvvatars
          value={userRoom.room.name || userRoom.room.id}
          style="shape"
          size={50}
        />
      </Avatar>
    </div>
  );
};

export default UserRoomsDisplay;
