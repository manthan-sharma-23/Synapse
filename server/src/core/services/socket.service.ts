import * as io from "socket.io";
import * as http from "http";
import RedisService from "./redis.service";
import { createAdapter } from "@socket.io/redis-adapter";
import db from "../../db/database.service";

const pubClient = new RedisService().client;
const subClient = pubClient.duplicate();

interface SocketCallback {
  (response: any): void;
}

const redis = new RedisService().client;
export default class SocketService {
  private io: io.Server;
  private user_map: Map<string, string>;

  constructor(server: http.Server) {
    this.user_map = new Map();
    this.io = new io.Server(server, {
      //@ts-ignore
      cors: {
        origin: "*",
      },
      adapter: createAdapter(pubClient, subClient),
    });
    this.listenEvents(this.io);
  }

  private async listenEvents(io: io.Server) {
    io.on("connection", (socket) => {
      socket.on("set-alive", async ({ userId }) => {
        this.user_map.set(socket.id, userId);
        await db.user.update_user_status({ userId, status: true });
      });

      socket.on(
        "find-by:username",
        async ({ username }, cb: SocketCallback) => {
          const users = await db.user.find_users_by_username({ username });

          cb(users);
        }
      );

      socket.on(
        "find-by:room-for-user",
        async ({ userId, personId }, cb: SocketCallback) => {
          if (!userId || !personId) {
            cb("No userId or personId provided");
            return;
          }
          const room = await db.room.find_room_for_peers({ userId, personId });
          cb(room);
          return;
        }
      );

      socket.on("disconnect", async () => {
        const userId = this.user_map.get(socket.id);
        this.user_map.delete(socket.id);
        if (userId) {
          await db.user.update_user_status({ userId, status: false });
          await db.user.update_user_last_seen({ id: userId });
        }
      });
    });
  }
}
