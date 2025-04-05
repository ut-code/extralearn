self.addEventListener("install", (event) => {
  console.log("sw.js: install");
  event.waitUntil(
    self.caches.open("v1").then((cache) => {
      cache.addAll(["/"]);
    }),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("sw.js: activate");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  console.log("sw.js: fetch " + event.request.url);
  // const url = new URL(event.request.url);
  // if (url.pathname === "/hello") {
  //   event.respondWith(Response.json({ message: "hello, world" }));
  // }
  event.respondWith(
    (async () => {
      const cache = await self.caches.open("v1");
      const res = await cache.match(event.request);
      if (res) {
        return res;
      } else {
        return new Response("not found", { status: 404 });
      }
    })(),
  );
});
