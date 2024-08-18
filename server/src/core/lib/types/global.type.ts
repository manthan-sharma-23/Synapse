import {
  SelectChat,
  SelectChatReadRecieptTable,
  SelectUser,
} from "../../../db";

export interface RoomChats {
  chats: SelectChat;
  users: SelectUser;
  // receipts: SelectChatReadRecieptTable[];
}
