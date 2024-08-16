import { Response } from "express";
import { Request } from "express";
import { CreateGroupInputValidator } from "../../core/lib/types/validators/group-invites.validators";
import databaseService from "../../db/database.service";

class InviteController {
  public async create_invite(req: Request, res: Response) {
    try {
      console.log(req.body);

      const input = CreateGroupInputValidator.parse(req.body);
      const { userId } = req.user;

      const group = await databaseService.room.create_room({
        createdBy: userId,
        type: "group",
        name: input.name,
      });

      const leader = await databaseService.group.add_group_member({
        userId,
        roomId: group.id,
      });

      return res.json({ ...group, user: leader });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  public async list_user_invites(req: Request, res: Response) {
    try {
      const { userId } = req.user;

      const invites = await databaseService.invites.list_user_invites({
        userId,
      });

      return res.json(invites);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

export default new InviteController();
