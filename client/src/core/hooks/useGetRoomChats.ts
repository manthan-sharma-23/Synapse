import { useSearchParams } from "react-router-dom";
import roomModel from "../api/room.model";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ChatAtom } from "../store/atom/chat.atom";

export const useGetRoomChats = () => {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const [chats, setChats] = useRecoilState(ChatAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      roomModel
        .get_room_chats({ roomId })
        .then((data) => {
          if (data) {
            setChats(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);

          setLoading(false);
        });
    }
  }, [roomId]);

  return { chats, loading };
};
