import { useGetAllUsersInApp } from "@/core/hooks/useGetAllUsersInApp";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Avvvatars from "avvvatars-react";
import LoadingPage from "../pages/LoadingPage";
import { Button } from "../ui/button";
import moment from "moment";
import { sendRequestToSocket } from "@/socket";
import { useRecoilValue } from "recoil";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import { IGroupInvite } from "@/core/lib/types/schema";
import { toast } from "sonner";

const CommandBoxForUserInvites = () => {
  const { users, loading, roomId } = useGetAllUsersInApp();
  const creator = useRecoilValue(UserSelector);

  if (loading) {
    return <LoadingPage />;
  }

  const sendInvite = async ({ userId }: { userId: string }) => {
    if (creator) {
      const res = (await sendRequestToSocket("event:invite-user-to-group", {
        roomId,
        userId,
        createdBy: creator.id,
      })) as IGroupInvite;

      if (res) {
        toast.success("User invited successfully");
      }
    }

    return;
  };

  return (
    <div className="w-full h-auto">
      <Command>
        <CommandInput placeholder="Search for user by username" />
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup heading="Users">
            {users &&
              users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  className="flex justify-between items-center my-1"
                >
                  <div className="flex justify-start h-full items-center gap-3">
                    <Avatar className="h-[3rem] w-[3rem]">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        <Avvvatars
                          value={user.name || user.username}
                          size={45}
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center items-start">
                      <div className="flex gap-4 items-center font-medium font-poppins">
                        {user.name && <p>{user.name}</p>}
                        <p>@{user.username}</p>
                        {user.status && <p className="bg-green-500" />}
                      </div>
                      {user.status ? (
                        <div className="flex justify-start items-center gap-1">
                          <p className="bg-green-500 h-3 w-3 rounded-full" />
                          <p>Online</p>
                        </div>
                      ) : (
                        <p className="text-gray-600/70 font-medium ">
                          Last seen {moment(user.lastLoggedIn).fromNow()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => sendInvite({ userId: user.id })}
                    size={"sm"}
                  >
                    Invite
                  </Button>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandBoxForUserInvites;
