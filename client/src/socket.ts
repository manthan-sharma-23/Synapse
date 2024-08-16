import { io } from "socket.io-client";
import { configurations } from "./core/lib/config/config";

export const socket = io(configurations.server.http_url, {
  autoConnect: false,
});
