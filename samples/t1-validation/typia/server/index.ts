import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import init from "./init.ts";
import typia from "typia";
import { typiaValidator } from "@hono/typia-validator";

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
  typiaValidator(
    "json",
    typia.createValidate<{
      password: string;
      data: { name?: string; password?: string };
    }>(),
  ),
  async (c) => {
    const id = typia.assert<number>(Number.parseInt(c.req.param().id));
    const body = c.req.valid("json");

    const res = await prisma.user.update({
      where: { id, password: body.password },
      data: body.data,
    });
    return c.json(res, 201);
  },
);

export default app;
