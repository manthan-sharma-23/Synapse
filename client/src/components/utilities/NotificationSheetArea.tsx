import { useGetUserInvites } from "@/core/hooks/useGetUserInvites";
import { sendRequestToSocket, socket } from "@/socket";
import { useEffect } from "react";
import LoadingPage from "../pages/LoadingPage";
import "@/styles/scroll-bar.css";
import moment from "moment";
import { Button } from "../ui/button";
import { useRecoilValue } from "recoil";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import { IGroupInvite, IRoom } from "@/core/lib/types/schema";
import { useNavigate } from "react-router-dom";

const NotificationSheetArea = () => {
  const { invites, loading, setInvites } = useGetUserInvites();
  const user = useRecoilValue(UserSelector);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("event:new-group-invite", (data) => {
      console.log(data);
    });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <LoadingPage />;
  }

  const acceptInvite = async (inviteId: string) => {
    const res = (await sendRequestToSocket("update:invite", {
      userId: user.id,
      status: "accepted",
      inviteId: inviteId,
    })) as { room: IRoom; invite: IGroupInvite };

    if (res) {
      setInvites(
        invites.map((invite) => {
          if (invite.invite.id === inviteId) {
            invite.invite.status = "accepted";
          }
          return invite;
        })
      );
      const params = new URLSearchParams({ roomId: res.room.id });
      navigate(`/?${params}`);
    }
  };

  const rejectInvite = async (inviteId: string) => {
    const res = (await sendRequestToSocket("update:invite", {
      userId: user.id,
      status: "rejected",
      inviteId: inviteId,
    })) as { room: IRoom; invite: IGroupInvite };

    if (res) {
      setInvites(
        invites.map((invite) => {
          if (invite.invite.id === inviteId) {
            invite.invite.status = "rejected";
          }
          return invite;
        })
      );
    }
  };

  return (
    <div className="h-full w-full mt-5 overflow-y-scroll custom-scrollbar pr-3 ">
      {invites &&
        invites.map((invite) => {
          return (
            <div
              key={invite.invite.id}
              className="my-2 h-[20vh] w-full border p-3 px-5 rounded-lg flex items-start flex-col justify-center gap-2"
            >
              <p className="font-semibold font-poppins text-3xl">
                {invite.group.name}
              </p>
              <div className="font-poppins text-gray-500 font-medium">
                Invited by: {invite.createdBy.name}
              </div>
              <p className="font-poppins text-gray-500 font-medium">
                Invited at: {moment(invite.invite.createdAt).format("lll")}
              </p>
              {invite.invite.status === "pending" && (
                <div className="w-full flex justify-end items-center gap-2">
                  <Button
                    onClick={() => rejectInvite(invite.invite.id)}
                    size={"sm"}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => acceptInvite(invite.invite.id)}
                    size={"sm"}
                  >
                    Accept
                  </Button>
                </div>
              )}
              {invite.invite.status === "rejected" && (
                <div className="w-full flex justify-end items-center gap-2">
                  <Button disabled size={"sm"}>
                    Rejected
                  </Button>
                </div>
              )}
              {invite.invite.status === "accepted" && (
                <div className="w-full flex justify-end items-center gap-2">
                  <Button disabled size={"sm"}>
                    Accepted
                  </Button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default NotificationSheetArea;
