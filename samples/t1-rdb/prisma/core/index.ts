import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(name: string) {
  return await prisma.user.create({
    data: {
      name,
    },
  });
}
export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
    },
  });
  if (!user) throw new Error("user not found");
  return user;
}

export async function createPost(creator: number, content: string) {
  return await prisma.post.create({
    data: { creatorId: creator, content },
  });
}
export async function getAllPosts() {
  return await prisma.post.findMany();
}

export async function getPost(id: number) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      creator: true,
    },
  });
}

export async function reset() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}
