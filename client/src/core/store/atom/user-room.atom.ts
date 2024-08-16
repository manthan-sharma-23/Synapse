import { UserRoomList } from "@/core/lib/types/global.types";
import { atom } from "recoil";

export const UserRoomsListAtom = atom({
  key: "user/room/list/key",
  default: [] as UserRoomList[],
});
