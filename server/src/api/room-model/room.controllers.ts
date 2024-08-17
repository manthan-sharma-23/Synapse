import { Response } from "express";
import { Request } from "express";
import databaseService from "../../db/database.service";
import { SelectUser } from "../../db";
import { redisService } from "../../core/services/redis.service";

class RoomController {
  async get_room_details(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { userId } = req.user;

      const roomDetailsFetchedFromDb =
        await databaseService.room.get_room_details({ roomId, userId });

      const room = roomDetailsFetchedFromDb[0].rooms;

      const users: SelectUser[] = [];

      roomDetailsFetchedFromDb.forEach((room) => {
        if (room.user_room.userId !== userId) {
          users.push(room.users);
        }
      });

      const count = await databaseService.room.number_of_members_in_room({
        roomId,
      });

      return res.status(200).json({ room, users, count });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  async get_room_chats(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      const chats_cached = await redisService.get_room_chats({ roomId });

      if (chats_cached) {
        return res.status(200).json(chats_cached);
      }

      const chats = await databaseService.chats.get_room_chats({ roomId });

      await redisService.set_room_chats({ chats, roomId });

      return res.status(200).json(chats);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  async get_room_media_n_users(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const details = await databaseService.room.room_details_expanded({
        roomId,
      });

      return res.status(200).json(details);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

export default new RoomController();
