import { RoomChats } from "../types/global.types";
import { IChat, IUser } from "../types/schema";

export interface BundledChat {
  user: IUser;
  messages: IChat[];
}

export const bundleMessagesByUser = (chats: RoomChats[]): BundledChat[] => {
  const bundledChats: BundledChat[] = [];

  let currentBundle: BundledChat | null = null;

  chats.forEach((chat) => {
    if (currentBundle && currentBundle.user.id === chat.users.id) {
      currentBundle.messages.push(chat.chats);
    } else {
      if (currentBundle) {
        bundledChats.push(currentBundle);
      }
      currentBundle = {
        user: chat.users,
        messages: [chat.chats],
      };
    }
  });

  if (currentBundle) {
    bundledChats.push(currentBundle);
  }

  return bundledChats;
};
