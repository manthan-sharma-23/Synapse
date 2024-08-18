import { RoomChats } from "../types/global.types";
import { IChat, IChatReadReceipt, IUser } from "../types/schema";

export interface BundledChat {
  user: IUser;
  messages: {
    chat: IChat;
    receipts: IChatReadReceipt[];
  }[];
}

export const bundleMessagesByUser = (chats: RoomChats[]): BundledChat[] => {
  const bundledChats: BundledChat[] = [];

  let currentBundle: BundledChat | null = null;

  chats.forEach((chat) => {
    // Check if we need to start a new bundle
    if (currentBundle && currentBundle.user.id === chat.users.id) {
      currentBundle.messages.push({
        chat: chat.chats,
        receipts: chat.receipts,
      });
    } else {
      if (currentBundle) {
        bundledChats.push(currentBundle);
      }
      currentBundle = {
        user: chat.users,
        messages: [
          {
            chat: chat.chats,
            receipts: chat.receipts,
          },
        ],
      };
    }
  });

  // Push the last bundle
  if (currentBundle) {
    bundledChats.push(currentBundle);
  }

  return bundledChats;
};
