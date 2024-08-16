import { FaInbox } from "react-icons/fa";

const NoConversationWindow = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-1 bg-white">
      <FaInbox className="text-7xl h-[5rem] w-[5rem] text-orange-400/70" />
      <p className="font-medium text-xl text-center text-wrap w-[20rem] font-poppins text-black/40">
        This is the very beginning of your legendary conversation
      </p>
    </div>
  );
};

export default NoConversationWindow;
