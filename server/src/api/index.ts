import { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import userRouter from "./user-model/user.routes";
import roomRouter from "./room-model/room.routes";
import chatRouter from "./user-model/user.routes";

const api = (app: Express) => {
  app
    .use(cors())
    .use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    )
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
    .use("/api/user", userRouter)
    .use("/api/room", roomRouter)
    .use("/api/chat", chatRouter);

  return app;
};

export default api;
