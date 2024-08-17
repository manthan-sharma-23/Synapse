import { IChat, IRoom, IUser } from "./schema";

export type axiosError = { response: { data: string } };
export interface RoomChats {
  chats: IChat;
  users: IUser;
}

export interface UserRoomList {
  room: IRoom;
  chat: IChat | null;
  member: IUser | null;
  new?: boolean;
}
