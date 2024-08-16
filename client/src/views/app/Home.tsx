import { UserSelector } from "@/core/store/selectors/user.selectors";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { IRoom, IUser } from "@/core/lib/types/schema";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BiSearchAlt } from "react-icons/bi";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chat from "./chat/Chat";
import UserRoomsDisplay from "@/components/utilities/UserRoomsDisplay";
import { socket } from "@/socket";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  const user = useRecoilValue(UserSelector);
  const [resultedUsers, setResultedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      if (user) {
        socket.emit("set-alive", { userId: user?.id });
      }
    });

    return () => {
      console.log("Component unmounted");

      socket.disconnect();
    };
  }, [user, roomId]);

  useEffect(() => {
    searchUsername();
  }, [username]);

  const searchUsername = async () => {
    if (username.startsWith("@")) {
      console.log(username);
      const pass = username.slice(1);
      const search = (await sendRequest("find-by:username", {
        username: pass,
      })) as IUser[];
      setResultedUsers(search);
    } else {
      setResultedUsers([]);
    }
  };

  function sendRequest(type: string, data: unknown = {}) {
    return new Promise((resolve, reject) => {
      if (!socket) {
        console.log("No socket state active");
        return;
      }
      socket.emit(type, data, (response: unknown, err: unknown) => {
        if (!err) {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  }

  const navigateToUserChat = async (person: IUser) => {
    const room = (await sendRequest("find-by:room-for-user", {
      userId: user!.id,
      personId: person.id,
    })) as IRoom;

    console.log(room);

    const params = new URLSearchParams({ roomId: room.id });
    setUsername("");
    navigate(`/?${params}`);
  };

  return (
    <div className="h-full w-full flex justify-center items-center overflow-hidden">
      <div className="h-full w-1/3 border-r border-2">
        <div className="p-4 px-7 flex justify-start gap-6  items-center w-full">
          {user && (
            <Avatar className="h-[3rem] w-[3rem]">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>
                <Avvvatars value={user.username} size={55} />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="relative flex justify-start items-center w-full">
            <div className="relative w-[100%]">
              <Input
                type="search"
                placeholder="Search with '@' for users"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={clsx(
                  "w-full pl-10 pr-2 ring-1 ring-black/30 shadow h-[6vh] text-[.9rem] bg-shade",
                  resultedUsers.length > 0 && "font-semibold"
                )}
              />
              <BiSearchAlt className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/60" />
            </div>
            {resultedUsers && resultedUsers.length > 0 && (
              <Card className="top-full mt-1 absolute border bg-white w-full ring-black/30 shadow-md ring-1 p-2 z-20 flex flex-col justify-start items-start gap-2">
                {resultedUsers.map(
                  (search_user) =>
                    user?.id !== search_user.id && (
                      <div
                        key={search_user.id}
                        onClick={() => navigateToUserChat(search_user)}
                        className="flex w-full items-center justify-start gap-3 hover:bg-shade p-2 rounded-md cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage src={search_user.image || ""} />
                          <AvatarFallback>
                            <Avvvatars value={search_user.username} size={32} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="h-full flex flex-col">
                          <p className="text-[.9rem] font-poppins">
                            {search_user.name}
                          </p>
                          <p className="font-semibold text-sm">
                            @{search_user.username}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </Card>
            )}
          </div>
        </div>
        <div className="h-[7%] w-full border-y"></div>
        <div className="h-[83%] w-full">
          <UserRoomsDisplay />
        </div>
      </div>
      <div className="h-full w-2/3">{socket && <Chat />}</div>
    </div>
  );
};

export default Home;
