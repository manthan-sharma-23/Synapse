import { Redis } from "ioredis";
import { env } from "../config/env";
import { SelectChat } from "../../db";
import { RoomChats } from "../lib/types/global.type";

class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
  }

  async update_room_chats(input: { chat: RoomChats; roomId: string }) {
    const chat_key = this.room_chat_key(input.roomId);
    const chats_cache = await this.redis.get(chat_key);
    let chats: RoomChats[];
    if (!chats_cache) {
      chats = [input.chat];
    } else {
      const cache_chat_arr = this.parse_to_chats_array(chats_cache);
      chats = [...cache_chat_arr, input.chat];
    }

    await this.redis.set(chat_key, JSON.stringify(chats));
  }

  async set_room_chats(input: { chats: RoomChats[]; roomId: string }) {
    const chat_key = this.room_chat_key(input.roomId);

    await this.redis.set(chat_key, JSON.stringify(input.chats));
  }

  async get_room_chats(input: { roomId: string }) {
    const chat_key = this.room_chat_key(input.roomId);
    const chats = await this.redis.get(chat_key);

    if (!chats) {
      return null;
    } else {
      return this.parse_to_chats_array(chats);
    }
  }

  private parse_to_chats_array(chats: string) {
    return JSON.parse(chats) as RoomChats[];
  }

  private room_chat_key(roomId: string) {
    return `room-chat-${roomId}`;
  }

  get client() {
    return this.redis;
  }
}

export default RedisService;

export const redisService = new RedisService();
