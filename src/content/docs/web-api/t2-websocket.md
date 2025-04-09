---
title: WebSocket
---

## WebSocket について
ut.code(); Learn では ToDo アプリを通じてフルスタックアプリの開発について学んできましたが、ここではチャットアプリを作ることを考えてみましょう。チャットアプリでは、ユーザー A がサーバーにメッセージを送ったときに、ユーザー B の画面にもそのメッセージが表示される必要があります。つまり、サーバーからクライアントへイベントを送信する必要があるのです。そこで、[WebSocket](https://developer.mozilla.org/ja/docs/Web/API/WebSockets_API) や [Server-Sent Events](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events) を用います。
今回は特に WebSocket を用いてチャットアプリを作ってみます。WebSocket とは、双方向通信を行うためのプロトコルで、初回リクエストは HTTP を用いますが、そこからは TCP 上で動きます。

