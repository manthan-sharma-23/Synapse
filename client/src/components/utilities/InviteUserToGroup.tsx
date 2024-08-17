import { IoMdPersonAdd } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import CommandBoxForUserInvites from "./CommandBoxForUserInvites";

const InviteUserToGroup = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            size={"icon"}
            className="rounded-3xl text-xl bg-red-500 hover:bg-white border border-red-500 hover:text-red-500"
          >
            <IoMdPersonAdd />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Users To Group</DialogTitle>
          </DialogHeader>
          <CommandBoxForUserInvites />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteUserToGroup;
