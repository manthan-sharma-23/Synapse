import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthLayout from "./components/layouts/AuthLayout";
import Signin from "./views/auth/Signin";
import Signup from "./views/auth/Signup";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./views/app/Home";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import Profile from "./views/app/profile/Profile";

const App = () => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/signup" element={<Signup />} />
            </Route>
            <Route path="/" element={<RootLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
