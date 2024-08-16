import { IChat, IUser } from "./schema";

export type axiosError = { response: { data: string } };
export interface RoomChats {
  chats: IChat;
  users: IUser;
}
