import { Hono } from "hono";

const app = new Hono()
  .get("/no-header", async (c) => {
    return c.text(`text sent from server ${Math.random()}`);
  })
  .delete("/no-header", async (c) => {
    return c.text("deleted!");
  })
  .get("/with-header", async (c) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    return c.text(`text sent from server ${Math.random()}`);
  })
  .delete("/with-header", async (c) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    return c.text("deleted!");
  })
  .options("*", async (c) => {
    // ふつうはすべてのリクエストに付与するが、する場合としない場合を分けたいためクエリで場合分けする。
    if (c.req.query("options") != null) {
      c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    }
    c.header("Access-Control-Allow-Methods", "GET,DELETE");
    return c.body(null);
  });

export default app;
