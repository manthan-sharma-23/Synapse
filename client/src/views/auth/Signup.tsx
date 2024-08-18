import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { AuthenticateUser } from "@/core/lib/types/auth.types";
import userModel from "@/core/api/user.model";

export default function Signup() {
  const [user, setUser] = useState<Partial<AuthenticateUser>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const combineLastAndFirstName = (): string => {
    return firstName.trim() + " " + lastName.trim();
  };

  const handleRegister = async () => {
    if (user.email && user.password) {
      setLoading(true);
      const res = await userModel.user.register_user({
        name: combineLastAndFirstName(),
        email: user.email,
        password: user.password,
      });

      if (res.isLoggedIn) {
        toast.success("User Registered succssfully");
        window.location.assign("/");
      } else {
        toast.error(res.message);
      }

      setLoading(false);
    } else {
      toast.error("Please add both email and password !");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                disabled={loading}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                id="first-name"
                placeholder="Max"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                disabled={loading}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                id="last-name"
                placeholder="Robinson"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={loading}
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => {
                setUser((user) => ({ ...user, email: e.target.value }));
              }}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              disabled={loading}
              id="password"
              type="password"
              onChange={(e) => {
                setUser((user) => ({ ...user, password: e.target.value }));
              }}
            />
          </div>
          <Button
            disabled={loading}
            onClick={handleRegister}
            type="submit"
            className="w-full"
          >
            Create an account
          </Button>
          <Button disabled={loading} variant="outline" className="w-full">
            Sign up with GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
