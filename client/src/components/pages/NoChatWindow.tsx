import { FaRegComments } from "react-icons/fa6";

const NoChatWindow = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-3  bg-shade">
      <FaRegComments className="text-6xl text-orange-400" />
      <p className="font-medium text-xl font-poppins">
        Select a chat to continue
      </p>
    </div>
  );
};

export default NoChatWindow;
