import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import invitesModel from "@/core/api/invites.model";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserRoomsListAtom } from "@/core/store/atom/user-room.atom";

const CreateGroupButton = () => {
  const [groupName, setGroupName] = useState("");
  const setUserRooms = useSetRecoilState(UserRoomsListAtom);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createGroup = () => {
    setLoading(true);
    invitesModel
      .create_group({ name: groupName })
      .then((data) => {
        if (data) {
          setUserRooms((v) => [{ room: data, chat: null, member: null }, ...v]);
          const params = new URLSearchParams({ roomId: data.id });
          navigate(`/?${params}`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size={"sm"}
          className="rounded-3xl bg-red-500 hover:bg-white border border-red-500 hover:text-red-500"
        >
          Create group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>{" "}
        </DialogHeader>
        <div className="w-full h-auto mt-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              onChange={(e) => setGroupName(e.target.value)}
              disabled={loading}
              type="text"
              id="name"
              placeholder="Group Name"
            />
          </div>
          <div className=" mt-3 w-full flex justify-end items-center ">
            <Button
              onClick={createGroup}
              disabled={loading}
              size={"sm"}
              className=" bg-red-500 hover:bg-white border border-red-500 hover:text-red-500"
            >
              Create group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupButton;
