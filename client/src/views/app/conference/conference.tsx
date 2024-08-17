import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MdAddIcCall } from "react-icons/md";
import ConferenceMain from "./main";

const Conference = () => {
  return (
    <Drawer>
      <DrawerTrigger className="h-full w-auto items-center flex">
        <Button
          className="text-xl bg-shade text-red-500 border border-red-500 hover:bg-red-500  hover:text-white"
          size={"icon"}
        >
          <MdAddIcCall />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[100vh] w-full rounded-none">
        <ConferenceMain />
      </DrawerContent>
    </Drawer>
  );
};

export default Conference;
