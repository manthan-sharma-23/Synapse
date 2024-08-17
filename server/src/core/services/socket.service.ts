import * as io from "socket.io";
import * as http from "http";
import RedisService, { redisService } from "./redis.service";
import db from "../../db/database.service";
import { SelectUser } from "../../db";
import databaseService from "../../db/database.service";
import s3Service from "./s3.service";
import { createAdapter } from "@socket.io/redis-adapter";

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
        console.log("ALIVE THINGY", userId);

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

      //relay
      socket.on("join:room", ({ roomId }) => {
        console.log("JOIN REQ");

        socket.join(roomId);
      });

      // events
      socket.on("event:typing", ({ roomId, user }) => {
        socket
          .to(roomId)
          .emit(
            "user:typing",
            `${user.name.split(" ")[0] || user.username} is typing...`
          );
      });

      socket.on("event:stop-typing", ({ roomId, user }) => {
        socket.to(roomId).emit("user:stop-typing", user);
      });

      socket.on("event:message", async (data) => {
        console.log(data);

        const { user, roomId, message } = data as {
          user: { user: SelectUser };
          roomId: string;
          message: {
            url?: string;
            text?: string;
            type: "text" | "image" | "video";
          };
        };
        const chat = await db.chats.add_chat_to_room({
          userId: user.user.id,
          roomId: roomId,
          type: message.type,
          text: message.text || null,
          url: message.url || null,
        });

        socket.to(roomId).emit("user:message", chat);
        socket.emit("user:message", chat);

        redisService.update_room_chats({ chat, roomId });

        // relay the new message to all the active users side pannel
        const room_card = await databaseService.userRoom.get_room_latest_card({
          userId: user.user.id,
          roomId,
        });

        const users = await databaseService.room.list_all_room_users({
          roomId,
        });
        users.forEach((user) => {
          const socketId = this.isUserOnline(user.userId);

          if (socketId) {
            this.io.to(socketId).emit("block:update", room_card);
          }
        });
      });

      socket.on(
        "event:file",
        async ({ userId, roomId, fileName }, cb: SocketCallback) => {
          const data = await s3Service.generate_presigned_url({
            userId,
            roomId,
            fileName,
          });

          cb(data);

          return;
        }
      );

      socket.on("event:user-leave-room", ({ roomId }) => {
        console.log("\nLEFT ROOM\n", roomId);
        socket.leave(roomId);
      });

      socket.on(
        "event:invite-user-to-group",
        async ({ roomId, userId, createdBy }, cb: SocketCallback) => {
          const invite = await db.invites.create_group_invite({
            userId,
            roomId,
            createdBy,
          });

          cb(invite);

          const socketOn = this.isUserOnline(invite.userId);

          if (socketOn) {
            const invites = await databaseService.invites.list_user_invites({
              userId,
            });
            io.to(socketOn).emit("event:new-group-invite", {
              invite: invites[0],
            });
          }

          return;
        }
      );

      socket.on("update:invite", async (data, cb: SocketCallback) => {
        const { status, inviteId, userId } = data as {
          userId: string;
          inviteId: string;
          status: "accepted" | "rejected";
        };

        const { room, invite } =
          await databaseService.invites.update_invite_status({
            status,
            inviteId,
            userId,
          });

        cb({ room, invite });

        return;
      });

      socket.on("disconnect", async () => {
        const userId = this.user_map.get(socket.id);
        this.user_map.delete(socket.id);
        console.log("ALIVE THINGY oFF");

        if (userId) {
          await db.user.update_user_status({ userId, status: false });
          await db.user.update_user_last_seen({ id: userId });
        }
      });
    });
  }

  private isUserOnline(userId: string) {
    for (const [key, value] of this.user_map.entries()) {
      if (value === userId) {
        return key;
      }
    }
    return false;
  }
}
