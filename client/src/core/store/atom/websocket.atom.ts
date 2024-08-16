import { atom } from "recoil";
import { Socket } from "socket.io-client";

export const WebSocketAtom = atom({
  key: "web/socket/atom/default/key",
  default: null as Socket | null,
});
