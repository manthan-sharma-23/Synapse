import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import roomModel from "../api/room.model";

export const useGetRoomDetails = () => {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  const {
    data: roomDetails,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryFn: () => roomModel.get_room_details({ roomId: roomId! }),
    queryKey: ["room/details", { roomId }],
  });

  return { roomDetails, loading, error, roomId };
};
