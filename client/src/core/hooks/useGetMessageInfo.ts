import { useEffect, useState } from "react";
import roomModel from "../api/room.model";

const useGetMessageInfo = ({ chatId }: { chatId: string }) => {
  const [info, setInfo] = useState<
    {
      readAt: Date | null;
      name: string | null;
      username: string;
      status: "delivered" | "read" | null;
      image: string | null;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    roomModel
      .get_message_info({ chatId })
      .then((data) => {
        if (data) {
          setInfo(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return { info, loading };
};

export default useGetMessageInfo;
