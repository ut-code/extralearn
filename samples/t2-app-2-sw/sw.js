self.addEventListener("install", (event) => {
  console.log("sw.js: install");
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("sw.js: activate");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  console.log("sw.js: fetch " + event.request.url);
  const url = new URL(event.request.url);
  if (url.pathname === "/hello") {
    event.respondWith(Response.json({ message: "hello, world" }));
  }
  // else {
  //   event.respondWith(new Response(null, {status: 500}));
  // }
});
