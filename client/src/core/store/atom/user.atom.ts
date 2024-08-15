import { GetUserQuery } from "@/core/lib/types/query.types";
import { atom } from "recoil";

export const UserAtom = atom({
  key: "user/global/atom",
  default: null as GetUserQuery | null,
});
