import * as schema from "./schema";
import db from "../db/index";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { like } from "drizzle-orm";
import { or } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { ne } from "drizzle-orm";
import { notInArray } from "drizzle-orm";

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

  private async list_all_users_not_in_room({ roomId }: { roomId: string }) {
    const users = await db
      .select({
        id: schema.userTable.id,
        name: schema.userTable.name,
        username: schema.userTable.username,
        email: schema.userTable.email,
        image: schema.userTable.image,
        lastLoggedIn: schema.userTable.lastLoggedIn,
        status: schema.userTable.status,
      })
      .from(schema.userTable)
      .where(
        notInArray(
          schema.userTable.id,
          db
            .select({
              userId: schema.userRoomTable.userId,
            })
            .from(schema.userRoomTable)
            .where(eq(schema.userRoomTable.roomId, roomId))
        )
      )
      .orderBy(desc(schema.userTable.lastLoggedIn));

    return users;
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
      .innerJoin(
        schema.userTable,
        eq(schema.userTable.id, schema.chatTable.userId)
      )
      .offset(input.offset || 0)
      .limit(25);

    return chats;
  }

  private async add_chat_to_room(input: schema.InsertChat) {
    const chat_create = (
      await db.insert(schema.chatTable).values(input).returning()
    )[0];

    const chat = await db
      .select()
      .from(schema.chatTable)
      .where(eq(schema.chatTable.id, chat_create.id))
      .innerJoin(schema.userTable, eq(schema.userTable.id, chat_create.userId))
      .limit(1);

    return chat[0];
  }

  private async get_user_rooms({ userId }: { userId: string }) {
    const rooms = await db.transaction(async (tx) => {
      const user_rooms = await tx
        .select({
          id: schema.userRoomTable.id,
          userId: schema.userRoomTable.userId,
          roomId: schema.userRoomTable.roomId,
          joinedAt: schema.userRoomTable.joinedAt,
        })
        .from(schema.userRoomTable)
        .where(eq(schema.userRoomTable.userId, userId))
        .leftJoin(
          schema.chatTable,
          eq(schema.chatTable.roomId, schema.userRoomTable.id)
        )
        .orderBy(desc(schema.chatTable.createdAt));

      const roomDetails: {
        room: schema.SelectRoom;
        chat?: schema.SelectChat | null;
        member?: {
          name: string | null;
          image: string | null;
          username: string;
        } | null;
      }[] = [];

      user_rooms.forEach(async (user_room) => {
        const room = (
          await tx
            .select()
            .from(schema.roomTable)
            .where(eq(schema.roomTable.id, user_room.roomId))
            .leftJoin(
              schema.userRoomTable,
              and(
                eq(schema.userRoomTable.roomId, user_room.roomId),
                ne(schema.userRoomTable.userId, userId)
              )
            )
            .leftJoin(
              schema.userTable,
              eq(schema.userTable.id, schema.userRoomTable.userId)
            )
            .leftJoin(
              schema.chatTable,
              eq(schema.chatTable.roomId, schema.roomTable.id)
            )
            .orderBy(desc(schema.chatTable.createdAt))
            .limit(1)
        )[0];

        if (room.rooms.type === "peer") {
          roomDetails.push({
            room: room.rooms,
            chat: room.chats,
            member: room.users,
          });
        } else {
          roomDetails.push({ room: room.rooms, chat: room.chats });
        }
      });

      return roomDetails;
    });

    return rooms;
  }

  private async create_group_invite(input: schema.InsertGroupInvite) {
    const invite = await db.transaction(async (tx) => {
      const invite_ = (
        await tx
          .select()
          .from(schema.groupInviteTable)
          .where(
            and(
              eq(schema.groupInviteTable.roomId, input.roomId),
              eq(schema.groupInviteTable.userId, input.userId),
              eq(schema.groupInviteTable.status, "pending")
            )
          )
          .limit(1)
      )[0];
      if (invite_) {
        return invite_;
      }

      const invite = (
        await tx.insert(schema.groupInviteTable).values(input).returning()
      )[0];

      return invite;
    });
    return invite;
  }

  private async list_all_room_users(input: { roomId: string }) {
    const users = await db
      .select()
      .from(schema.userRoomTable)
      .where(eq(schema.userRoomTable.roomId, input.roomId));

    return users;
  }
  private get_room_latest_card = async (input: {
    roomId: string;
    userId: string;
  }) => {
    const room = (
      await db
        .select()
        .from(schema.roomTable)
        .where(eq(schema.roomTable.id, input.roomId))
        .leftJoin(
          schema.userRoomTable,
          and(eq(schema.userRoomTable.roomId, input.roomId))
        )
        .leftJoin(
          schema.userTable,
          eq(schema.userTable.id, schema.userRoomTable.userId)
        )
        .leftJoin(
          schema.chatTable,
          eq(schema.chatTable.roomId, schema.roomTable.id)
        )
        .orderBy(desc(schema.chatTable.createdAt))
        .limit(1)
    )[0];

    return { room: room.rooms, chat: room.chats, member: room.users };
  };

  private async list_user_invites(input: { userId: string }) {
    const invites = await db
      .select({
        group: {
          name: schema.roomTable.name,
          roomId: schema.roomTable.id,
        },
        invite: {
          createdBy: schema.groupInviteTable.createdBy,
          createdAt: schema.groupInviteTable.createdAt,
          status: schema.groupInviteTable.status,
          id: schema.groupInviteTable.id,
        },
        createdBy: {
          id: schema.userTable.id,
          name: schema.userTable.name,
          image: schema.userTable.image,
          username: schema.userTable.username,
        },
      })
      .from(schema.groupInviteTable)
      .where(eq(schema.groupInviteTable.userId, input.userId))
      .innerJoin(
        schema.roomTable,
        and(
          eq(schema.roomTable.type, "group"),
          eq(schema.roomTable.id, schema.groupInviteTable.roomId)
        )
      )
      .innerJoin(
        schema.userTable,
        eq(schema.groupInviteTable.createdBy, schema.userTable.id)
      )
      .orderBy(desc(schema.groupInviteTable.createdAt));

    return invites;
  }

  private async add_group_member(input: schema.InsertUserRoom) {
    const user_room = (
      await db.insert(schema.userRoomTable).values(input).returning()
    )[0];

    return user_room;
  }

  private async update_invite_status(input: {
    userId: string;
    inviteId: string;
    status: "accepted" | "rejected";
  }) {
    const invite = await db.transaction(async (tx) => {
      const invite = (
        await tx
          .update(schema.groupInviteTable)
          .set({ status: input.status })
          .where(eq(schema.groupInviteTable.id, input.inviteId))
          .returning()
      )[0];

      const room = (
        await tx
          .select()
          .from(schema.roomTable)
          .where(and(eq(schema.roomTable.id, invite.roomId)))
      )[0];

      if (input.status === "accepted") {
        await tx.insert(schema.userRoomTable).values({
          roomId: invite.roomId,
          userId: invite.userId,
        });
      }

      return { invite, room };
    });

    return invite;
  }

  get room() {
    return {
      create_room: this.create_room,
      select_room_by_id: this.select_room_by_id,
      find_room_for_peers: this.find_room_for_peers,
      get_room_details: this.get_room_details,
      list_all_users_not_in_room: this.list_all_users_not_in_room,
      list_all_room_users: this.list_all_room_users,
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
      get_user_rooms: this.get_user_rooms,
      get_room_latest_card: this.get_room_latest_card,
    };
  }

  get chats() {
    return {
      get_room_chats: this.get_room_chats,
      add_chat_to_room: this.add_chat_to_room,
    };
  }

  get invites() {
    return {
      create_group_invite: this.create_group_invite,
      list_user_invites: this.list_user_invites,
      update_invite_status: this.update_invite_status,
    };
  }

  get group() {
    return {
      add_group_member: this.add_group_member,
    };
  }
}

export default new DatabaseService();
