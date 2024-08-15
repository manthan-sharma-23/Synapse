import { useGetUser } from "@/core/hooks/useGetUser";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { loading } = useGetUser();

  if (loading) {
    return <div>Loading..</div>;
  }
  return (
    <div className="h-screen w-screen overflow-hidden flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default RootLayout;
