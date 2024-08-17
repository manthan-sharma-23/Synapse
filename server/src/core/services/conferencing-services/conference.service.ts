import * as io from "socket.io";
import Room from "./room";

export class ConferenceService {
  io: io.Server;
  roomList: Map<string, Room>;

  constructor(io: io.Server) {
    this.io = io;
    this.roomList = new Map();
    this.listenToEvents(this.io);
  }

  private async listenToEvents(io: io.Server) {
    io.on("connection", (socket) => {});
  }
}
