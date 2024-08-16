import { IUser, IUserPreferences, IRoom } from "./schema";

export interface GetUserQuery {
  user: IUser;
  user_preferences: IUserPreferences;
}

export type CreateGroupMutation = IRoom & { user: IUser };
