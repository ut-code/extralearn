import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { stream } from "hono/streaming";

const app = new Hono()
  .use(
    serveStatic({
      root: "./public",
    }),
  )
  .get("/sse", async (c) => {
    c.header("Content-Type", "text/event-stream");
    return stream(c, async (stream) => {
      let time = 0;
      while (true) {
        await stream.write(`event: ping\ndata: ${++time}\n\n`);
        await stream.sleep(2000);
      }
    });
  });
export default app;
