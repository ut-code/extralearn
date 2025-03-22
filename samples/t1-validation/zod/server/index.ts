import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import init from "./init.ts";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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

app.patch(
  "/users/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator(
    "json",
    z.object({
      password: z.string(),
      data: z.object({
        name: z.string().optional(),
        password: z.string().optional(),
      }),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const res = await prisma.user.update({
      where: { id, password: body.password },
      data: body.data,
    });
    return c.json(res, 201);
  },
);

export default app;
