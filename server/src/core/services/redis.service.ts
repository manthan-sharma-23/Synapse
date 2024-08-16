import { Redis } from "ioredis";
import { env } from "../config/env";
import { SelectChat } from "../../db";

class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
  }

  async update_room_chats(input: { chat: SelectChat; roomId: string }) {
    const chat_key = this.room_chat_key(input.roomId);
    const chats_cache = await this.redis.get(chat_key);
    let chats: SelectChat[];
    if (!chats_cache) {
      chats = [input.chat];
    } else {
      const cache_chat_arr = this.parse_to_chats_array(chats_cache);
      chats = [...cache_chat_arr, input.chat];
    }

    await this.redis.set(chat_key, JSON.stringify(chats));
  }

  private parse_to_chats_array(chats: string) {
    return JSON.parse(chats) as SelectChat[];
  }

  private room_chat_key(roomId: string) {
    return `room-chat-${roomId}`;
  }

  get client() {
    return this.redis;
  }
}

export default RedisService;
