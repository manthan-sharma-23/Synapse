import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import roomModel from "../api/room.model";

export const useGetExpandedRoomDetails = () => {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expanded/room/details/api", { roomId }],
    queryFn: () => roomModel.get_room_details_n_media({ roomId: roomId! }),
  });

  return { data, isLoading, isError };
};
