import { useRecoilState } from "recoil";
import { UserAtom } from "../store/atom/user.atom";
import { useEffect, useState } from "react";
import userModel from "../api/user.model";

export const useGetUser = () => {
  const token = window.localStorage.getItem("token");
  const [user, setUserState] = useRecoilState(UserAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userModel.user
      .get_user()
      .then((data) => {
        setUserState(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, [token]);

  return { user: user?.user, loading };
};
