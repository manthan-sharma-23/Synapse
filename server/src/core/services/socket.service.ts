import * as io from "socket.io";
import * as http from "http";

export default class SocketService {
  private io: io.Server;

  constructor(server: http.Server) {
    this.io = new io.Server(server, {});
    this.listenEvents(this.io);
  }

  private async listenEvents(io: io.Server) {
    io.on("connection", (socket) => {
      socket.on("set-alive", ({ userId }) => {});
    });
  }
}
