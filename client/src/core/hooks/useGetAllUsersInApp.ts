import { useEffect, useState } from "react";
import { IUser } from "../lib/types/schema";
import userModel from "../api/user.model";
import { useSearchParams } from "react-router-dom";

export const useGetAllUsersInApp = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      userModel
        .list_all_users({ roomId })
        .then((data) => {
          if (data) {
            setUsers(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  return { users, loading, roomId };
};
