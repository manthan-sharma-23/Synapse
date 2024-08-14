import * as io from "socket.io";
import * as http from "http";

export default class SocketService {
  private socket: io.Server;

  constructor(server: http.Server) {
    this.socket = new io.Server(server);
  }
}
