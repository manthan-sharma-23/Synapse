import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { userId: string } & JwtPayload;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    roomId?: string;
  }
}
