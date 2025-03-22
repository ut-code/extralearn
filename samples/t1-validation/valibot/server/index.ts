import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import * as v from "valibot";
import init from "./init.ts";
import { vValidator } from "@hono/valibot-validator";

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
  vValidator(
    "param",
    v.object({ id: v.pipe(v.string(), v.transform(Number.parseInt)) }),
  ),
  vValidator(
    "json",
    v.object({
      password: v.string(),
      data: v.object({
        name: v.optional(v.string()),
        password: v.optional(v.string()),
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
