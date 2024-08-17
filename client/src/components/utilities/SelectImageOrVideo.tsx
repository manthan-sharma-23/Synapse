import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { sendRequestToSocket, socket } from "@/socket";
import { useRecoilValue } from "recoil";
import { UserSelector } from "@/core/store/selectors/user.selectors";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { IUser } from "@/core/lib/types/schema";

const formatFileSize = (sizeInBytes: number) => {
  const sizeInMB = sizeInBytes / (1024 * 1024); // Convert bytes to MB
  return sizeInMB.toFixed(2); // Format to 2 decimal places
};

const SelectImageOrVideo = () => {
  const [file, setFile] = useState<File | null>(null);
  const user = useRecoilValue(UserSelector);
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Store only the first file
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!user) {
      toast.error("You are not logged in");
      return;
    }

    if (!roomId) {
      toast.error("No room id provided");
      return;
    }

    try {
      const response = (await sendRequestToSocket("event:file", {
        roomId,
        userId: user.id,
        fileName: file.name.split(" ")[0],
      })) as {
        url: string;
        pre_sign_url: string;
        key: string;
        contentType: string;
      };

      if (response.pre_sign_url) {
        await axios.put(response.pre_sign_url, file, {
          headers: {
            "Content-Type": response.contentType,
          },
        });

        const event_data: {
          user: { user: IUser };
          roomId: string;
          message: {
            url?: string;
            text?: string;
            type: string;
          };
        } = {
          user: {
            user,
          },
          roomId,
          message: {
            url: response.url,
            type: response.contentType.split("/")[0],
          },
        };

        socket.emit("event:message", event_data);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Failed to get the pre-signed URL.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("An error occurred during the file upload.");
    }
  };

  return (
    <div className="h-full w-full">
      <DialogHeader>
        <DialogTitle>Send Media Over Chat</DialogTitle>
      </DialogHeader>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="h-[25vh] w-full my-3 flex justify-center items-center">
          <Input
            multiple={false}
            onChange={handleFileChange}
            type="file"
            accept="image/*,video/*"
            className="h-full w-full flex justify-center items-center bg-yellow-100"
          />
        </div>
        {file && (
          <div className="my-2 text-center">
            <p>Selected file: {file.name}</p>
            <p>Size: {formatFileSize(file.size)} MB</p>
 
          </div>
        )}
        <div className="w-full h-auto flex justify-end items-center">
          <Button size="sm" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectImageOrVideo;
