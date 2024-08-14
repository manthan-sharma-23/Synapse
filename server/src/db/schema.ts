import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    image: varchar("image", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_idx").on(table.email),
    usernameIdx: uniqueIndex("user_username_idx").on(table.username),
  })
);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("user_preferences").primaryKey().defaultRandom(),
  theme: varchar("theme", { length: 255 }).default("default"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const room = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull().$type<"peer" | "group">(),
  name: varchar("name", { length: 20 }).notNull(), // Consider adding notNull() if it's required
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRoom = pgTable(
  "user_room",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    roomId: uuid("room_id")
      .notNull()
      .references(() => room.id),
    joinedAt: timestamp("joined_at").notNull(),
  },
  (table) => ({
    userRoomIdx: uniqueIndex("user_room_idx").on(table.userId, table.roomId), // Renamed index for clarity
  })
);

export const chat = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull().$type<"text" | "image" | "video">(),
  url: varchar("url", { length: 255 }), // Made nullable for non-media chats
  createdAt: timestamp("created_at").notNull().defaultNow(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
