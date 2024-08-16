import { Router } from "express";
import { AuthenticationMiddleware } from "../../core/middlewares/authentication.middleware";
import inviteController from "./invite.controller";

const router: Router = Router();

router
  .post("/create", AuthenticationMiddleware, inviteController.create_invite)
  .get("/", AuthenticationMiddleware, inviteController.list_user_invites);

export default router;
