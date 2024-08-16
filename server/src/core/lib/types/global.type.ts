import { SelectChat, SelectUser } from "../../../db";

export interface RoomChats {
  chats: SelectChat;
  users: SelectUser;
}
