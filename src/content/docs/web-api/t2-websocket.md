---
title: WebSocket
---

## WebSocket について
ut.code(); Learn では ToDo アプリを通じてフルスタックアプリの開発について学んできましたが、ここではチャットアプリを作ることを考えてみましょう。チャットアプリでは、ユーザー A がサーバーにメッセージを送ったときに、ユーザー B の画面にもそのメッセージが表示される必要があります。つまり、サーバーからクライアントへイベントを送信する必要があるのです。そこで、[WebSocket](https://developer.mozilla.org/ja/docs/Web/API/WebSockets_API) や [Server-Sent Events](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events) を用います。
今回は特に WebSocket を用いてチャットアプリを作ってみます。WebSocket とは、双方向通信を行うためのプロトコルで、HTTP リクエストのように一度きりではなく、一度確立されると接続が維持され続けます。接続確立時（ハンドシェイク時）には HTTP を利用しますが、その後のメッセージには HTTP ヘッダーがなく軽量です。

## 早速つなげてみよう
フロントエンドは `bun create vite@latest web`、バックエンドは `bun create hono@latest server` でそれぞれのディレクトリを作成します。
```svelte
// /web/src/App.svelte
<script lang="ts">
  import { onMount } from "svelte";

  let socket: null | WebSocket = null;
  let message = "";

  onMount(() => {
    socket = new WebSocket("ws://localhost:3000/ws");
    socket.onopen = () => {
      console.log("socket connected");
    };
    socket.onmessage = (event) => {
      message = event.data;
    } 
  })
</script>

<div>message: {message}</div>
<button onclick={() => socket?.send("hello from client")}>send</button>
```
```ts
// /server/src/index.ts
import { Hono } from "hono"
import { createBunWebSocket } from "hono/bun"
import { type ServerWebSocket } from "bun"

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>()

const app = new Hono()

app.get("/", (c) => {
    return c.text("Hello Hono")
})

app.get(
    "/ws",
    upgradeWebSocket((c) => {
        return {
            onMessage(event, ws) {
                console.log(`Message from client: ${event.data}`)
                ws.send("Hello from server!")
            },
            onClose: () => {
                console.log("Connection closed")
            },
        }
    })
)

export default {
    fetch: app.fetch,
    websocket
}
```

## Bun の Pub/Sub 機能について
サーバーがどのクライアントにメッセージを送るべきかを考えてみましょう。
たとえばチャットアプリでは、自分が送ったメッセージを自分に返しても意味がないし、関係ない人全員に見せてしまうのも困りますよね。
そこで役立つのが「Pub/Sub（パブ・サブ）機能」です。
これは、「トピック」という名前のグループを作り、

- 誰かがトピックにメッセージを送る（publish）
- そのトピックに登録している人だけがメッセージを受け取る（subscribe）

という仕組みです。
たとえば「room1」というチャットルームにいる人だけが「room1」に送られたメッセージを受け取る、そんなイメージです。
Bunでは、このPub/Subの仕組みを簡単に使えるAPIが用意されています。

## リアルタイムチャットアプリを作ってみよう
ディレクトリ構成は先ほどのまま、ファイルを書き換えてみましょう。以下のコードでは、あるタブで送信したメッセージが、他のタブにもリアルタイムで反映されます。
```svelte
// /web/src/App.svelte
<script lang="ts">
  import { onMount } from "svelte";

  type Message = {
    text: string;
  };

  let socket: null | WebSocket = null;
  let messages: Message[] = [];
  let newMessage = "";

  onMount(() => {
    socket = new WebSocket("ws://localhost:3000/ws");
    socket.onopen = () => {
      console.log("socket connected");
    };
    socket.onmessage = (event) => {
      messages = JSON.parse(event.data);
    };
  });
</script>

<ul>
  {#each messages as message}
    <li>{message.text}</li>
  {/each}
</ul>
<input bind:value={newMessage} />
<button
  onclick={() => {
    socket?.send(JSON.stringify({ text: newMessage }));
    newMessage = "";
  }}>send</button
>

```

```ts
// /server/src/index.ts
import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

type Message = {
    text: string;
};

const messages: Message[] = [{ text: "Hello" }];

const chatRoom = "chat-room";

const app = new Hono();

const server = Bun.serve({
    fetch: app.fetch,
    websocket,
});

app.get(
    "/ws",
    upgradeWebSocket((c) => {
        return {
            onOpen(event, ws) {
                ws.raw?.subscribe(chatRoom);
                ws.send(JSON.stringify(messages));
            },
            onMessage(event, ws) {
                const newMessage: Message = JSON.parse(event.data.toString());
                messages.push(newMessage);
                server.publish(chatRoom, JSON.stringify(messages));
            },
            onClose: (event, ws) => {
                ws.raw?.unsubscribe(chatRoom);
            },
        };
    }),
);

export default app;

```