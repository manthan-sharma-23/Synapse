import { NextFunction, Request, Response } from "express";
import jwtService from "../services/jwt.service";
import { UNAUTHORIZED_ACCESS } from "../lib/errors";

export const AuthenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization") as string;

  if (token.startsWith("Bearer ")) token = token.split(" ")[1];

  const user = jwtService.decode_token(token);

  if (!user || !user.userId) {
    return res
      .status(UNAUTHORIZED_ACCESS.code)
      .json({ message: UNAUTHORIZED_ACCESS.action.message });
  }

  req.user = user;

  next();
};
