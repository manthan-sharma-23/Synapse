import { useRecoilState } from "recoil";
import { UserRoomsListAtom } from "../store/atom/user-room.atom";
import { useEffect, useState } from "react";
import userModel from "../api/user.model";

export const useGetUserRooms = () => {
  const [userRooms, setUserRooms] = useRecoilState(UserRoomsListAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userModel
      .get_user_rooms()
      .then((data) => {
        if (data) {
          setUserRooms(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return { userRooms, loading, setUserRooms };
};
