import { useGetUser } from "@/core/hooks/useGetUser";
import { Outlet, useNavigate } from "react-router-dom";

const RootLayout = () => {
  const navigate = useNavigate();
  const { loading, user } = useGetUser();
  const token = window.localStorage.getItem("token");

  if (loading) {
    return <div>Loading..</div>;
  }

  if ((!user && !loading) || !token) {
    navigate("/auth/signin");
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default RootLayout;
