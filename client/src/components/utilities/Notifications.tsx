import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size={"sm"}
          className="bg-white text-red-500 text-lg border border-red-500 rounded-full hover:text-white hover:bg-red-500"
        >
          <FaBell />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Here you will see you list of notifications and invites.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
