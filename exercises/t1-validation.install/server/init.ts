import type { PrismaClient } from "@prisma/client";

export default async function init(client: PrismaClient) {
  await client.user.createMany({
    data: [
      {
        name: "aster-void",
        password: Math.random().toString(),
      },
    ],
  });
}
