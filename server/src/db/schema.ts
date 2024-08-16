import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    image: varchar("image", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: boolean("online_status").default(false).notNull(),
    lastLoggedIn: timestamp("last_logged_in").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_idx").on(table.email),
    usernameIdx: uniqueIndex("user_username_idx").on(table.username),
  })
);

export const userPreferencesTable = pgTable("user_preferences", {
  id: uuid("user_preferences").primaryKey().defaultRandom(),
  theme: varchar("theme", { length: 255 }).default("default"),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const roomTable = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull().$type<"peer" | "group">(),
  name: varchar("name", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRoomTable = pgTable(
  "user_room",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    roomId: uuid("room_id")
      .notNull()
      .references(() => roomTable.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => ({
    userRoomIdx: uniqueIndex("user_room_idx").on(table.userId, table.roomId), // Renamed index for clarity
  })
);

export const chatTable = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull().$type<"text" | "image" | "video">(),
  url: varchar("url", { length: 255 }), // Made nullable for non-media chats
  createdAt: timestamp("created_at").notNull().defaultNow(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => roomTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// RELATIONS

export const userPreferencesRelation = relations(userTable, ({ one }) => ({
  preferences: one(userPreferencesTable, {
    fields: [userTable.id],
    references: [userPreferencesTable.userId],
  }),
}));

export const userRoomRelation = relations(userTable, ({ many }) => ({
  rooms: many(roomTable),
}));

export const userChatRelation = relations(userTable, ({ many }) => ({
  chats: many(chatTable),
}));

export const roomChatRelation = relations(roomTable, ({ many }) => ({
  chats: many(chatTable),
}));

export type InsertRoom = typeof roomTable.$inferInsert;
export type SelectRoom = typeof roomTable.$inferSelect;

export type InsertUserRoom = typeof userRoomTable.$inferInsert;
export type SelectUserRoom = typeof userRoomTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertChat = typeof chatTable.$inferInsert;
export type SelectChat = typeof chatTable.$inferSelect;
