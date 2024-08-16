import * as schema from "./schema";
import db from "../db/index";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { like } from "drizzle-orm";
import { or } from "drizzle-orm";

export class DatabaseService {
  private async get_user(input: { userId: string }) {
    const user = await db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.id, input.userId))
      .leftJoin(
        schema.userPreferencesTable,
        eq(schema.userPreferencesTable.userId, input.userId)
      );

    return user[0];
  }

  private async find_users_by_username(input: Partial<schema.SelectUser>) {
    const users = await db
      .select()
      .from(schema.userTable)
      .where(like(schema.userTable.username, `${input.username}%`))
      .limit(10);

    return users;
  }

  private async find_user_by_email(input: Partial<schema.SelectUser>) {
    const user = (
      await db
        .select()
        .from(schema.userTable)
        .where(eq(schema.userTable.email, input.email!))
    )[0];

    return user;
  }

  private async update_user_last_seen(input: Partial<schema.SelectUser>) {
    await db
      .update(schema.userTable)
      .set({ lastLoggedIn: new Date() })
      .where(eq(schema.userTable.id, input.id!));
  }

  private async create_user(input: schema.InsertUser) {
    const user = await db.transaction(async (tx) => {
      const user = (
        await tx.insert(schema.userTable).values(input).returning()
      )[0];

      await tx.insert(schema.userPreferencesTable).values({
        userId: user.id,
      });

      return user;
    });

    return user;
  }

  private async update_user_status(input: { userId: string; status: boolean }) {
    try {
      await db
        .update(schema.userTable)
        .set({ status: input.status })
        .where(eq(schema.userTable.id, input.userId));
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  private async select_room_by_id(input: { id: string }) {
    const room = await db
      .select()
      .from(schema.roomTable)
      .where(eq(schema.roomTable.id, input.id));
    return room;
  }

  private async create_room(input: schema.InsertRoom) {
    const room = (
      await db.insert(schema.roomTable).values(input).returning()
    )[0];

    return room;
  }

  private find_room_for_peers = async (input: {
    personId: string;
    userId: string;
  }) => {
    const rooms_with_users = await db
      .select({
        roomId: schema.roomTable.id,
        userId: schema.userRoomTable.userId,
      })
      .from(schema.roomTable)
      .innerJoin(
        schema.userRoomTable,
        eq(schema.roomTable.id, schema.userRoomTable.roomId)
      )
      .where(
        or(
          eq(schema.userRoomTable.userId, input.personId),
          eq(schema.userRoomTable.userId, input.userId)
        )
      );

    const roomMap = new Map<string, Set<string>>();

    rooms_with_users.forEach((entry) => {
      if (!roomMap.has(entry.roomId)) {
        roomMap.set(entry.roomId, new Set());
      }
      roomMap.get(entry.roomId)!.add(entry.userId);
    });

    for (const [roomId, users] of roomMap.entries()) {
      if (users.has(input.personId) && users.has(input.userId)) {
        console.log("ROOM FOUND ", roomId);
        return { id: roomId };
      }
    }

    // If no common room is found, create a new one
    const room = await db.transaction(async (tx) => {
      const room = (
        await tx
          .insert(schema.roomTable)
          .values({
            type: "peer",
          })
          .returning()
      )[0];

      await tx.insert(schema.userRoomTable).values({
        userId: input.personId,
        roomId: room.id,
      });
      await tx.insert(schema.userRoomTable).values({
        userId: input.userId,
        roomId: room.id,
      });

      return room;
    });

    return room;
  };

  private async get_user_room(input: { userId: string; roomId: string }) {
    let room = await db
      .select()
      .from(schema.roomTable)
      .innerJoin(
        schema.userRoomTable,
        and(eq(schema.userRoomTable.roomId, input.roomId))
      );

    room = room.filter((obj) => obj.user_room.userId !== input.userId);

    return room;
  }

  private async get_room_details(input: { userId: string; roomId: string }) {
    const details = await db
      .select()
      .from(schema.roomTable)
      .where(eq(schema.roomTable.id, input.roomId))
      .innerJoin(
        schema.userRoomTable,
        eq(schema.userRoomTable.roomId, input.roomId)
      )
      .innerJoin(
        schema.userTable,
        eq(schema.userRoomTable.userId, schema.userTable.id)
      );

    return details;
  }

  private async create_user_room(input: schema.InsertUserRoom) {
    const user_room = (
      await db.insert(schema.userRoomTable).values(input).returning()
    )[0];

    return user_room;
  }

  private async delete_user_room(input: schema.SelectUserRoom) {
    const user_room = (
      await db
        .delete(schema.userRoomTable)
        .where(
          and(
            eq(schema.userRoomTable.roomId, input.roomId),
            eq(schema.userRoomTable.userId, input.userId)
          )
        )
        .returning()
    )[0];

    return user_room;
  }

  private async get_room_chats(input: { roomId: string; offset?: number }) {
    const chats = await db
      .select()
      .from(schema.chatTable)
      .where(eq(schema.chatTable.roomId, input.roomId))
      .leftJoin(
        schema.userTable,
        eq(schema.userTable.id, schema.chatTable.userId)
      )
      .offset(input.offset || 0)
      .limit(25);

    return chats;
  }

  private async add_chat_to_room(input: schema.InsertChat) {
    const chat = await db.insert(schema.chatTable).values(input).returning();
    return chat[0];
  }

  get room() {
    return {
      create_room: this.create_room,
      select_room_by_id: this.select_room_by_id,
      find_room_for_peers: this.find_room_for_peers,
      get_room_details: this.get_room_details,
    };
  }

  get user() {
    return {
      get_user: this.get_user,
      find_users_by_username: this.find_users_by_username,
      find_user_by_email: this.find_user_by_email,
      update_user_last_seen: this.update_user_last_seen,
      update_user_status: this.update_user_status,
      create_user: this.create_user,
    };
  }

  get userRoom() {
    return {
      create_user_room: this.create_user_room,
      get_user_room: this.get_user_room,
      delete_user_room: this.delete_user_room,
    };
  }

  get chats() {
    return {
      get_room_chats: this.get_room_chats,
      add_chat_to_room: this.add_chat_to_room,
    };
  }
}

export default new DatabaseService();
