import { Router } from "express";
import { AuthenticationMiddleware } from "../../core/middlewares/authentication.middleware";
import RoomControllers from "./room.controllers";

const router: Router = Router();

router
  .get(
    "/chats/:roomId",
    AuthenticationMiddleware,
    RoomControllers.get_room_chats
  )
  .get("/media/:roomId",AuthenticationMiddleware,RoomControllers.get_room_media_n_users)
  .get("/:roomId", AuthenticationMiddleware, RoomControllers.get_room_details);

export default router;
