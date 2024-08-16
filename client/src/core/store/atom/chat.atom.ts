import { RoomChats } from "@/core/lib/types/global.types";
import { atom } from "recoil";

export const ChatAtom = atom({
  key: "chat/key/atom/room",
  default: [] as RoomChats[],
});
