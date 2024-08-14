import { Router } from "express";
import { AuthenticationMiddleware } from "../../core/middlewares/authentication.middleware";
import UserController from "./user.controller";

const router: Router = Router();

router
  .get("/", AuthenticationMiddleware, UserController.get_user)
  .post("/login", UserController.login_user)
  .post("/register", UserController.register_user);

export default router;
