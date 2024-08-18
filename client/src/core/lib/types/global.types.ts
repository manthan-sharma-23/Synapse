import { IChat, IChatReadReceipt, IRoom, IUser } from "./schema";

export type axiosError = { response: { data: string } };
export interface RoomChats {
  chats: IChat;
  users: IUser;
  receipts: IChatReadReceipt[];
}

export interface UserRoomList {
  room: IRoom;
  chat: IChat | null;
  member: IUser | null;
  new?: boolean;
}

export interface RoomExpandedDetails {
  users: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
    status: boolean;
    lastLoggedIn: Date;
    roomId: string;
    userRoomId: string;
  }[];
  media: IChat[];
  room: IRoom;
}
