import { Response } from "express";
import { Request } from "express";
import {
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS,
  USER_ALREADY_EXISTS,
  USER_CREATED_SUCCESSFULLY,
  USER_DOESNT_EXISTS,
  USER_LOGGED_IN_SUCCESSFULLY,
} from "../../core/lib/errors";
import {
  UpdateUserProfileValidator,
  UserValidator,
} from "../../core/lib/types/validators/user.validators";
import bcryptService from "../../core/services/bcrypt.service";
import jwtService from "../../core/services/jwt.service";
import databaseService from "../../db/database.service";
import s3Service from "../../core/services/s3.service";

class UserController {
  async get_user(req: Request, res: Response) {
    try {
      const { userId } = req.user;

      const user = await databaseService.user.get_user({ userId });

      return res.status(200).json({
        user: user.users,
        user_preferences: user.user_preferences,
      });
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(INTERNAL_SERVER_ERROR.code);
    }
  }

  async login_user(req: Request, res: Response) {
    try {
      const input = UserValidator.parse(req.body);

      const user = await databaseService.user.find_user_by_email({
        email: input.email,
      });

      if (!user) {
        return res
          .status(USER_DOESNT_EXISTS.code)
          .json({ message: USER_DOESNT_EXISTS.action.message });
      }

      const password_check = await bcryptService.compare_password(
        input.password,
        user.password
      );

      if (!password_check)
        return res
          .status(INVALID_CREDENTIALS.code)
          .json({ message: INVALID_CREDENTIALS.action.message });

      await databaseService.user.update_user_last_seen(user);

      const token = jwtService.sign_token({ userId: user.id });
      return res.status(USER_LOGGED_IN_SUCCESSFULLY.code).json({
        message: USER_LOGGED_IN_SUCCESSFULLY.action.message,
        token,
      });
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(INTERNAL_SERVER_ERROR.code);
    }
  }

  async get_user_rooms(req: Request, res: Response) {
    try {
      const { userId } = req.user;

      const rooms = await databaseService.userRoom.get_user_rooms({ userId });

      return res.status(200).json(rooms);
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(500);
    }
  }

  async register_user(req: Request, res: Response) {
    try {
      const input = UserValidator.parse(req.body);

      const user = await databaseService.user.find_user_by_email({
        email: input.email,
      });

      if (user) {
        return res
          .status(USER_ALREADY_EXISTS.code)
          .json(USER_ALREADY_EXISTS.action);
      }

      const hash_password = await bcryptService.hash_password(input.password);
      const username = input.email.split("@")[0];

      const created_user = await databaseService.user.create_user({
        ...input,
        password: hash_password,
        username,
      });

      const token = jwtService.sign_token({ userId: created_user.id });

      return res
        .status(USER_CREATED_SUCCESSFULLY.code)
        .json({ message: USER_CREATED_SUCCESSFULLY.action.message, token });
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(INTERNAL_SERVER_ERROR.code);
    }
  }

  async get_all_users_in_app(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const users = await databaseService.room.list_all_users_not_in_room({
        roomId,
      });
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  async update_profile_picture(req: Request, res: Response) {
    try {
      const { fileName } = req.body;
      const { userId } = req.user;

      console.log(fileName);

      const data = await s3Service.generate_presigned_url_user({
        userId,
        fileName,
      });
      console.log(data);

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  async check_username_validity(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { userId } = req.user;

      const data = await databaseService.user.check_username_availibility({
        userId,
        username,
      });

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  async update_profile(req: Request, res: Response) {
    try {
      console.log("UPDATE ", req.body);

      const { username, name, url } = UpdateUserProfileValidator.parse(
        req.body
      );
      const { userId } = req.user;

      const data = await databaseService.user.update_user_profile({
        id: userId,
        username,
        name,
        url,
      });

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

export default new UserController();
