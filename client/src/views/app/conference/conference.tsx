import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MdAddIcCall } from "react-icons/md";
import ConferenceMain from "./main";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendRequestToSocket } from "@/socket";
import { PiPhoneCallFill } from "react-icons/pi";

const Conference = () => {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const [isCallOnGoing, setCallOnGoing] = useState(false);

  useEffect(() => {
    checkCall();
  }, [roomId]);

  const checkCall = async () => {
    const res = (await sendRequestToSocket("check:room", {
      roomId,
    })) as boolean;
    console.log("RSULT", res);

    setCallOnGoing(res);
  };

  return (
    <Drawer>
      <DrawerTrigger className="h-full w-auto items-center flex">
        {!isCallOnGoing ? (
          <Button
            className="text-xl bg-shade text-red-500 border border-red-500 hover:bg-red-500  hover:text-white"
            size={"icon"}
          >
            <MdAddIcCall />
          </Button>
        ) : (
          <Button
            className="text-xl bg-white border border-green-500 text-green-600  hover:text-white hover:bg-green-500"
            size={"icon"}
          >
            <PiPhoneCallFill />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[100vh] w-full rounded-none">
        <ConferenceMain />
      </DrawerContent>
    </Drawer>
  );
};

export default Conference;