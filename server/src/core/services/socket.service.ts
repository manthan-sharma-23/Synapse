import * as io from "socket.io";
import * as http from "http";
import RedisService from "./redis.service";

const redis = new RedisService().client;
export default class SocketService {
  private io: io.Server;
  private user_map: Map<string, string>;

  constructor(server: http.Server) {
    this.user_map = new Map();
    this.io = new io.Server(server, {});
    this.listenEvents(this.io);
  }

  private async listenEvents(io: io.Server) {
    io.on("connection", (socket) => {
      socket.on("set-alive", async ({ userId }) => {
        this.user_map.set(socket.id, userId);
        await redis.set(`user-alive-${userId}`, "ALIVE");
      });

      socket.on("disconnect", async () => {
        const userId = this.user_map.get(socket.id);
        this.user_map.delete(socket.id);
        await redis.set(`user-alive-${userId}`, "DEAD");
      });
    });
  }
}
