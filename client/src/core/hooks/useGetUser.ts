import { useSetRecoilState } from "recoil";
import { UserAtom } from "../store/atom/user.atom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import userModel from "../api/user.model";

export const useGetUser = () => {
  const token = window.localStorage.getItem("token");
  const setUserState = useSetRecoilState(UserAtom);
  const { data, isLoading, isError } = useQuery({
    queryFn: () => userModel.user.get_user(),
    queryKey: ["user", "state", "global"],
  });

  useEffect(() => {
    if (data) {
      setUserState(data);
    }
  }, [token, isLoading, isError]);

  return { loading: isLoading, error: isError };
};
