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
import db, { userTable } from "../../db";
import { UserValidator } from "../../core/lib/types/validators/user.validators";
import bcryptService from "../../core/services/bcrypt.service";
import jwtService from "../../core/services/jwt.service";
import { eq } from "drizzle-orm";

class UserController {
  async get_user(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      console.log(userId);

      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId));

      return res.json(user[0]);
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(INTERNAL_SERVER_ERROR.code);
    }
  }

  async login_user(req: Request, res: Response) {
    try {
      const input = UserValidator.parse(req.body);

      const user = await db.query.userTable.findFirst({
        where: (user, { eq }) => eq(user.email, input.email),
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

  async register_user(req: Request, res: Response) {
    try {
      const input = UserValidator.parse(req.body);

      const user = await db.query.userTable.findFirst({
        where: (user, { eq }) => eq(user.email, input.email),
      });

      if (user) {
        return res
          .status(USER_ALREADY_EXISTS.code)
          .json(USER_ALREADY_EXISTS.action);
      }

      const hash_password = await bcryptService.hash_password(input.password);
      const username = input.email.split("@")[0];

      const create_user = await db
        .insert(userTable)
        .values({
          email: input.email,
          username,
          name: input.name,
          password: hash_password,
        })
        .returning();

      const token = jwtService.sign_token({ userId: create_user[0].id });

      return res
        .status(USER_CREATED_SUCCESSFULLY.code)
        .json({ message: USER_CREATED_SUCCESSFULLY.action.message, token });
    } catch (error) {
      console.log("ERROR :: ", error);
      return res.sendStatus(INTERNAL_SERVER_ERROR.code);
    }
  }
}

export default new UserController();
