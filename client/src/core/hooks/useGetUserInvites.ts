import { useEffect, useState } from "react";
import { IUserInvites } from "../lib/types/schema";
import invitesModel from "../api/invites.model";

export const useGetUserInvites = () => {
  const [invites, setInvites] = useState<IUserInvites[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    invitesModel
      .list_user_invites()
      .then((data) => {
        if (data) {
          setInvites(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return { invites, setInvites, loading };
};
