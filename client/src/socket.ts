import { io } from "socket.io-client";
import { configurations } from "./core/lib/config/config";

export const socket = io(configurations.server.http_url, {
  autoConnect: false,
});

export function sendRequestToSocket(type: string, data: unknown = {}) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      console.log("No socket state active");
      return;
    }
    socket.emit(type, data, (response: unknown, err: unknown) => {
      if (!err) {
        resolve(response);
      } else {
        reject(err);
      }
    });
  });
}
