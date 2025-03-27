import { eq } from "drizzle-orm";
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
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    with: {
      posts: true,
      liked: {
        columns: {},
        with: {
          post: true,
        },
      },
    },
  });
  if (!user) throw new Error("user not found");
  return user;
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

export async function getPost(id: number) {
  const post = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, id),
    with: {
      creator: true,
      likedBy: {
        columns: {},
        with: {
          user: true,
        },
      },
    },
  });
  if (!post) throw new Error("post not found");
  return post;
}

export async function like(userId: number, postId: number) {
  return await db
    .insert(likedTable)
    .values({
      postId,
      userId,
    })
    .returning();
}

export async function reset() {
  await db.delete(usersTable);
  await db.delete(postsTable);
}
