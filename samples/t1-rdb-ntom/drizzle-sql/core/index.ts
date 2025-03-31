import { aliasedTable, and, eq, exists } from "drizzle-orm";
import { db } from "../db/client";
import { likedTable, postsTable, usersTable } from "../db/schema";

export async function createUser(name: string) {
  const users = await db
    .insert(usersTable)
    .values({
      name,
    })
    .returning();
  if (!users[0]) throw new Error("failed to create user");
  return users[0];
}
export async function getAllUsers() {
  return await db.select().from(usersTable);
}

export async function getUser(id: number) {
  const res = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      post: postsTable,
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(postsTable.creatorId, usersTable.id))
    .where(eq(usersTable.id, id));

  if (!res[0]) throw new Error("user not found");
  return {
    ...res[0],
    posts: res.map((user) => user.post).filter((post) => post !== null),
  };
}

export async function createPost(creator: number, content: string) {
  const posts = await db
    .insert(postsTable)
    .values({
      creatorId: creator,
      content,
    })
    .returning();
  if (!posts[0]) throw new Error("failed to create post");
  return posts[0];
}
export async function getAllPosts() {
  return await db.select().from(postsTable);
}

const creator = aliasedTable(usersTable, "creator");
const likedUsers = aliasedTable(usersTable, "liked_users");
export async function getPost(id: number) {
  const posts = await db
    .select({
      id: postsTable.id,
      content: postsTable.content,
      creator: creator,
      likedBy: likedUsers,
    })
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .innerJoin(creator, eq(usersTable.id, postsTable.creatorId))
    .leftJoin(
      likedUsers,
      exists(
        db
          .select()
          .from(likedTable)
          .where(
            and(
              eq(postsTable.id, likedTable.postId),
              eq(likedTable.userId, likedUsers.id),
            ),
          ),
      ),
    );

  if (!posts[0]) throw new Error("failed to fetch post");
  if (!posts[0].creator) throw new Error("post's creator doesn't exist");
  return posts[0];
}

export async function reset() {
  await db.delete(usersTable);
  await db.delete(postsTable);
}
