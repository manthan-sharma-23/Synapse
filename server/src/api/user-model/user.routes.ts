import { Router } from "express";
import { AuthenticationMiddleware } from "../../core/middlewares/authentication.middleware";
import UserController from "./user.controller";
import userController from "./user.controller";

const router: Router = Router();

router
  .get("/", AuthenticationMiddleware, UserController.get_user)
  .get(
    "/get-user-rooms",
    AuthenticationMiddleware,
    UserController.get_user_rooms
  )
  .get(
    "/all/:roomId",
    AuthenticationMiddleware,
    userController.get_all_users_in_app
  )
  .post("/login", UserController.login_user)
  .post("/register", UserController.register_user);

export default router;
