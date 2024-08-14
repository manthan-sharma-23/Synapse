import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

type User = { userId: string };

class JwtService {
  sign_token(user: User) {
    const token = jwt.sign(user, env.JWT_SECRET, {
      expiresIn: "5d",
    });
    return token;
  }

  decode_token(token: string) {
    const user = jwt.decode(token) as User;
    return user;
  }
}

export default new JwtService();
