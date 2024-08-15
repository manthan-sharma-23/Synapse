import { Outlet } from "react-router-dom";

import { Toaster } from "sonner";

const AuthLayout = () => {
  return (
    <div className="relative bg-white bg-[length:400%_400%] animate-gradientMove text-white h-screen w-screen flex justify-center items-center">
      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AuthLayout;
