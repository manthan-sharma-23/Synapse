import { useState } from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import { ImPhoneHangUp } from "react-icons/im";
import { DrawerClose } from "@/components/ui/drawer";

const ConferenceMain = () => {
  const [isMicOn, setMicOn] = useState(false);
  const [isVideoOn, setVideoOn] = useState(false);

  const turnMicOn = () => {
    setMicOn(true);
  };
  const turnMicOff = () => {
    setMicOn(false);
  };
  const turnVideoOff = () => {
    setVideoOn(false);
  };
  const turnVideoOn = () => {
    setVideoOn(true);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="h-[90%] w-full p-4"></div>
      <div className="h-[10%] w-full flex gap-8 items-center justify-center text-3xl">
        {isMicOn ? (
          <IoMdMic
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnMicOff}
          />
        ) : (
          <IoMdMicOff
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnMicOn}
          />
        )}
        {isVideoOn ? (
          <FaVideo
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnVideoOff}
          />
        ) : (
          <FaVideoSlash
            className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer"
            onClick={turnVideoOn}
          />
        )}
        <DrawerClose>
          <ImPhoneHangUp className="bg-red-600 text-white h-[3rem] w-[3rem] p-3 rounded-full cursor-pointer" />
        </DrawerClose>
      </div>
    </div>
  );
};

export default ConferenceMain;
