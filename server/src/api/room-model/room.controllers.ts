import { Response } from "express";
import { Request } from "express";
import databaseService from "../../db/database.service";
import { SelectUser } from "../../db";

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

      return res.status(200).json({ room, users });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

export default new RoomController();
