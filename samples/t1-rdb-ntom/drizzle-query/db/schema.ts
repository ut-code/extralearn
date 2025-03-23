import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const postsTable = sqliteTable("posts", {
  id: integer().primaryKey({ autoIncrement: true }),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text().notNull(),
});

export const likedTable = sqliteTable("liked", {
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  liked: many(likedTable),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [postsTable.creatorId],
    references: [usersTable.id],
  }),
  likedBy: many(likedTable),
}));

export const likedRelaitons = relations(likedTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [likedTable.userId],
    references: [usersTable.id],
  }),
  post: one(postsTable, {
    fields: [likedTable.postId],
    references: [postsTable.id],
  }),
}));
