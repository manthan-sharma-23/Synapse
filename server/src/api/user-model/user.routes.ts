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
    "/username/:username",
    AuthenticationMiddleware,
    userController.check_username_validity
  )
  .get(
    "/all/:roomId",
    AuthenticationMiddleware,
    userController.get_all_users_in_app
  )
  .post("/login", UserController.login_user)
  .post("/register", UserController.register_user)
  .put(
    "/update-profile-picture",
    AuthenticationMiddleware,
    UserController.update_profile_picture
  )
  .put("/update-user", AuthenticationMiddleware, UserController.update_profile);

export default router;
