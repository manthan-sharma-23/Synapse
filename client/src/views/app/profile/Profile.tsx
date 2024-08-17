import LoadingPage from "@/components/pages/LoadingPage";
import { useGetUser } from "@/core/hooks/useGetUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IUser } from "@/core/lib/types/schema";
import { toast, Toaster } from "sonner";
import { MdFileUpload } from "react-icons/md";
import userModel from "@/core/api/user.model";
import { IoMdArrowRoundBack } from "react-icons/io";

const Profile = () => {
  const { user: data_user, loading, error } = useGetUser();
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newL, setLoading] = useState(false);

  useEffect(() => {
    if (data_user) {
      setUser(data_user);
      setAvatarPreview(data_user.image);
    }
  }, [data_user]);

  if (error) {
    return (
      <div className="text-red-500">
        An error occurred. Please try again later.
      </div>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [id]: value } : undefined));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file); // Set the selected file
      setUser((prev) =>
        prev ? { ...prev, image: reader.result as string } : undefined
      );
    }
  };

  const handleUpdate = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        console.log("Uploading file:", selectedFile);
        const fileName = selectedFile.name;

        const url = await userModel.presign_user_picture({
          fileName,
          file: selectedFile,
        });

        console.log(url);

        if (url?.url && data_user) {
          const user = await userModel.update_user({
            url: url.url,
            name: data_user.name,
            username: data_user.username,
          });

          if (user.id) {
            setUser(user);
            toast.success("Profile picture updated", { richColors: true });
          } else {
            throw new Error();
          }
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Profile picture not updated");
        setLoading(false);
      }
    }
  };

  const checkUsernameAvailability = async () => {
    try {
      setLoading(true);
      if (!user || user?.username === data_user?.username) {
        toast.error("Edit the username first");
      }

      const isAvailable = await userModel.check_username({
        username: user!.username.toLowerCase(),
      });

      if (isAvailable) {
        toast.success("Username is available", { richColors: true });
      } else {
        toast.warning("Username is not available", { richColors: true });
      }
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't check, Please try again");
      setLoading(false);
      return error;
    }
  };

  const update_profile = async () => {
    try {
      setLoading(true);
      if (!user || user?.username === data_user?.username) {
        toast.error("Edit the username first");
      }

      const updated_user = await userModel.update_user({
        username: user!.username.toLowerCase(),
        name: user?.name,
        url: user?.image,
      });

      if (updated_user.id) {
        setUser(updated_user);
        toast.success("User updated successfully", { richColors: true });
      } else {
        toast.warning("User couldn't be updated", { richColors: true });
      }
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't check, Please try again");
      setLoading(false);
      return error;
    }
  };

  return (
    <div className="h-screen w-screen px-[25%] overflow-hidden font-poppins">
      <div className="py-4 pt-10 flex gap-2 items-center justify-start">
        <IoMdArrowRoundBack
          className="text-2xl cursor-pointer"
          onClick={() => {
            window.location.assign("/");
          }}
        />
        <h1 className="text-3xl font-medium">Profile</h1>
      </div>
      <div className="flex h-[30vh] w-full gap-2 items-center justify-center">
        <div className="flex flex-col h-full w-1/3 items-center justify-center rounded-2xl cursor-pointer">
          <Avatar className="h-[10rem] w-[10rem] transition-all cursor-pointer hover:bg-orange-200">
            <AvatarImage src={avatarPreview || ""} />
            <AvatarFallback>
              <Avvvatars
                value={user?.name || user?.username || ""}
                size={150}
              />
            </AvatarFallback>
          </Avatar>
          <div className="w-full flex items-center justify-center gap-1 mt-5">
            <Input
              disabled={newL}
              className="w-2/3 bg-yellow-50"
              accept="image/*"
              onChange={handleAvatarChange}
              type="file"
              multiple={false}
            />
            {selectedFile && (
              <Button disabled={newL} size={"icon"} onClick={handleUpdate}>
                <MdFileUpload />
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col h-full w-2/3 items-start justify-center gap-6 pl-[6rem]">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              disabled={newL}
              type="text"
              id="name"
              placeholder="Name"
              value={user?.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center space-x-2">
              <Input
                disabled={newL}
                type="text"
                id="username"
                placeholder="Username"
                value={user?.username || ""}
                onChange={handleInputChange}
              />
              <Button onClick={checkUsernameAvailability} disabled={newL}>
                Check
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button disabled={newL} onClick={update_profile}>
              Update
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Profile;
