import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import init from "./init.ts";

const prisma = new PrismaClient();
await init(prisma);
const app = new Hono();

app.get("/users", async (c) => {
  return c.json(
    await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  );
});

app.patch("/users/:id", async (c) => {
  const id = Number.parseInt(c.req.param().id);
  const body = (await c.req.json()) as {
    password: string;
    data: { name?: string; password?: string };
  };

  const res = await prisma.user.update({
    where: { id, password: body.password },
    data: body.data,
  });
  return c.json(res, 201);
});

export default app;
