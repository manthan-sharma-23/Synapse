import { IUser, IUserPreferences } from "./schema";

export interface GetUserQuery {
  user: IUser;
  user_preferences: IUserPreferences;
}
