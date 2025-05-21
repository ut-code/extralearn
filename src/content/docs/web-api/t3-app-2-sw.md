---
title: ウェブサイトのアプリ化 2 (Service Worker)
---

ウェブサイトを PWA に変換することでネイティブアプリのようにホーム画面にインストールすることができるようになりますが、それだけでは中身はただのウェブサイトへのブックマークに過ぎません。
例えばオフラインの環境では「ページを開けません」といった表示になり、全くアプリっぽさがありません。

Service Worker という技術を用いることにより、ウェブサイトをオフラインで動作させたりプッシュ通知を処理することができ、ネイティブアプリと同等の体験を提供することができます。
サービスワーカー自体は PWA とは独立した概念であり、PWA に Service Worker が必須というわけではありませんが、両者はいっしょに用いられることが多いです。

:::tip
以前はサービスワーカーがないと PWA アプリとして認識されなかったようです (そう書かれている記事が多いです) が、現在 (2025年4月現在) はそんなことはありません。
:::

:::caution
このページではプッシュ通知についてはまだ書いていません
(そのうち誰か追記する? 別ページ?)
:::

## サービスワーカーの基本

サービスワーカーはウェブページとは独立して動作する JavaScript のコードです。

以下に例を示します。

```html title="index.html"
<html>
  <head>
    <title>SW sample</title>
  </head>
  <body>
    hello, world!
    <script>
      // serviceWorker が実装されていない古いブラウザではなにもしない
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
      }
    </script>
  </body>
</html>
```

```js title="sw.js"
self.addEventListener("install", (event) => {
  console.log("sw.js: install");
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("sw.js: activate");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  console.log("sw.js: fetch");
});
```
:::caution
* サービスワーカーを登録するには、ウェブサイトが HTTPS または localhost (ポートは任意) でホストされている必要があります。
* サービスワーカーの install, activate イベントハンドラの中で非同期関数を呼び出す場合、イベントハンドラを async 関数にするのではなく、
    ```js
    event.waitUntil(promise);
    ```
    と記述し promise の完了までイベントを延長する必要があります。([ExtendableEvent.waitUntil](https://developer.mozilla.org/ja/docs/Web/API/ExtendableEvent/waitUntil))
:::

:::tip
* サービスワーカーはクライアントで動作する js ファイルなので、モジュールを import したり TypeScript を使いたい場合には、フロントエンド開発の場合と同様 webpack 等を用いて js ファイルにバンドルする必要があります。おそらく設定ファイルもソースコードもフロントエンドとは分けて扱うことになるでしょう。
* sw.js 内で使っている `self` は [ServiceWorkerGlobalScope](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope) です。
    * これはクライアントにおける `window` に相当するもので、 `window` と同様 `self` のプロパティは `self` を省略してグローバルにアクセスすることもできます。
* TypeScript で `self` の型を認識させるためには
    ```ts
    declare const self: ServiceWorkerGlobalScope;
    ```
    と書きます。
    * また、 `tsconfig.json` に `"lib": ["WebWorker"]` が必要です。
:::

### 初回アクセス時

* このページを開くと、 [`navigator.serviceWorker.register()`](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerContainer/register) を呼び出すことにより、サービスワーカーとして実行するファイルを登録します。
    * 返り値は [ServiceWorkerRegistration](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration) のプロミスで、サービスワーカーがインストール中かどうか、アクティブかどうかなどの情報が得られます。
* ブラウザは sw.js をフェッチし、サービスワーカーとして実行します。
    * sw.js では `self` に対して install イベント、 activate イベント、 fetch イベント のイベントハンドラーを設定します。
* 初回の実行なので、まずサービスワーカーが「インストール」され、 install イベントが実行されます。
* install イベントが完了したらサービスワーカーは「有効化」され、 activate イベントが実行されます。
* activate イベントが完了したら、以降新しく開かれたページをこのサービスワーカーが「制御」できるようになります。具体的に何ができるかは後述します。
    * すでに開いているページ (初回アクセス時のページ) でサービスワーカーを使用するにはページをリロードする必要があります。
    * または、activate イベントハンドラの中で [`self.clients.claim()`](https://developer.mozilla.org/ja/docs/Web/API/Clients/claim) を呼び出すことにより、すでに開いているページに対しても新しいサービスワーカーを適用することができます。
        * `claim()` はプロミスを返し、これを `event.waitUntil()` で待機する必要があります。
    * これ以降以降ページやブラウザを閉じたり新しく開いたりしても、有効化されたサービスワーカーは有効のままです。

### 2回目以降のアクセス時

* ページを開いた際、ブラウザは再度 sw.js をフェッチします。
    * この例では `navigator.serviceWorker.register()` が再度実行されますが、実行してもしなくても同じです。
* もしフェッチした sw.js の中身が変わっていなければ、何もしません (すでに有効化されているサービスワーカーが有効なままです)
* もしフェッチした sw.js の中身が1文字でも変わっている場合、新しいサービスワーカーが「インストール」され、 install イベントが実行されます。
この間以前のサービスワーカーは有効なままです。
* 初回と異なり、以前のサービスワーカーによって制御されているページ (タブ) がすべて閉じられるまでの間、新しいサービスワーカーの有効化は始まりません。
    * install イベントハンドラーの中で [`self.skipWaiting()`](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) を呼び出すことにより、これをスキップすることが可能です。
        * `skipWaiting()` はプロミスを返しますが、 await や waitUntil() する必要はないです。
* 新しいサービスワーカーが「有効化」され、 activate イベントが実行されます。
* activate イベントが完了したあとこのサービスワーカーがページを「制御」するのは `register()` が成功したあとに開かれたページに対してのみです。
    * すでに開いているページ (`skipWaiting` をした場合) は引き続き以前のサービスワーカーによって制御されます。
    * ウェブページと Service Worker を両方変更した場合に、整合性をとるためですかね。
    
:::tip
* iOS の PWA では、ページ (アプリ) を開いていない間にもバックグラウンドで新しいサービスワーカーをフェッチしてインストールする場合があるようです。
<!-- 逆にAndroidではほんとうに全く無いのか? -->
:::

## サービスワーカーのデバッグ

Chrome の開発者ツールの Application タブの中の Service Workers を開くと、登録されているサービスワーカーの状態を確認できます。
Unregister ボタンを押すことでサービスワーカーの登録を解除できます。

また、[chrome://inspect](chrome://inspect) の Service Worker タブで Inspect ボタンを押すことでサービスワーカーのコンソールにアクセスできる開発者ツールが開きます。

## サービスワーカーでページを制御する

サービスワーカーがページを「制御」するとは、クライアントからサーバーへのリクエスト (`fetch()` だけでなく &lt;img&gt; や &lt;script&gt; のソース、HTML 自体のリロードなども含めたすべて) に割り込んでプロキシーとして動作することです。

![ミドルウェア プロキシとしての Service Worker](./t3-app-2/a-service-worker-a-middl-982e684894b75_720.png)
(画像は [Service Worker | web.dev](https://web.dev/learn/pwa/service-workers?hl=ja) より)

:::tip
例外として、クライアントがサービスワーカー自体の js ファイルをフェッチするリクエストはサービスワーカーを無視します。
したがってサーバーに置かれているサービスワーカーの js ファイルが更新された場合には新しいサービスワーカーのインストールは確実に行われます。
:::

サービスワーカー内でリクエストを受け取りレスポンスを返すのは、 fetch イベントのイベントハンドラーです。
引数には [FetchEvent](https://developer.mozilla.org/ja/docs/Web/API/FetchEvent) が渡されます。
`event.request` で [Request](https://developer.mozilla.org/ja/docs/Web/API/Request) が得られ、`event.respondWith(response)` で [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) を返します。

```js title="sw.js"
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === "/hello") {
    event.respondWith(Response.json({ message: "hello, world" }));
  }
});
```

サービスワーカーのインストールと有効化が完了したあとに `/hello` にアクセスしてみると、(サーバー側にはそんなリソースはないにも関わらず) サービスワーカーが返したメッセージが得られることがわかります。

また開発者ツールの Network タブではこのようにレスポンスがサービスワーカーから返されたかどうかがわかります。
![サービスワーカーのレスポンス](./t3-app-2/sw_response.png)

`event.respondWith()` は同期的に (イベントハンドラが return する前に) 呼び出す必要があります。
以下のように非同期にレスポンスを返すことはできません。
```js
self.addEventListener("fetch", (event) => {
    doSomethingAsync().then(() => {
        event.respondWith(someResponse);
    });
});
```
`respondWith()` に Response で解決するプロミスを渡すことはできます。
```js
async function respondAsync() {
    await doSomethingAsync();
    return someResponse;
}
self.addEventListener("fetch", (event) => {
    event.respondWith(respondAsync());
});
```

`respondWith()` をせずに return した場合、クライアントは改めてサーバーにリクエストを送ります。
つまり、サービスワーカーが存在しなかった場合と同じ結果になります。

:::tip
[Hono](https://hono.dev/docs/getting-started/service-worker) などサービスワーカーで動作する Web サーバーフレームワークもあります。
:::

## サービスワーカーのスコープ

サービスワーカーは自身の js ファイルが置かれているのと同じ階層かそれ以下のページに対してしか「制御」しません。
そのため、サービスワーカーの js ファイルはページと同じオリジンの直下のパスに置きましょう。 (`https://example.com/sw.js` は OK、 `https://example.com/public/sw.js` だと public/ 以下のページしか機能しなくなります)

スコープを気にする必要があるのはページ自体のURLのみであり、例えばスコープ内のページがリクエストしたスコープ外のリソース (js ファイルより上の階層や、異なるドメイン) については問題なく制御することができます。

## キャッシュストレージ

サービスワーカーがページや静的なアセットファイルをストレージに保存しておき、サーバーの代わりにレスポンスを返すことで、端末がオフラインやネットワークが遅い環境でも高速にページを読み込むことができるようになります。

こういった用途のためサービスワーカー内で使えるストレージが [CacheStorage](https://developer.mozilla.org/ja/docs/Web/API/CacheStorage) です。
キャッシュストレージは Request をキーとし、対応する Response を保存しておくことができます。
キャッシュストレージには任意の名前をつけて複数作成することができます。

:::tip
キャッシュストレージはクライアント側の JavaScript でも利用可能です。(`window.caches`)
:::

### キャッシュストレージに保存する

[`Cache.put()`](https://developer.mozilla.org/ja/docs/Web/API/Cache/put) で Request と Response のペアを保存します。
以下の例では `/` に fetch リクエストをし、レスポンスを `v1` という名前のキャッシュストレージに保存します。

```js
const cache = await self.caches.open("v1");
const res = await fetch("/");
await cache.put("/", res);
```

:::caution
`cache.put()` に渡した Response オブジェクトはその後使用できません。
例えばキャッシュに保存したあとそれを `event.respondWith()` にも渡すというように使いまわしたい場合は、 [`Response.clone()`](https://developer.mozilla.org/ja/docs/Web/API/Response/clone) で複製する必要があります。
:::

リソースを fetch してそのままキャッシュストレージに保存するという処理は、[`Cache.add()`](https://developer.mozilla.org/ja/docs/Web/API/Cache/add) を使ってよりかんたんに書けます。

```js
const cache = await self.caches.open("v1");
await cache.add("/");
```

[`Cache.addAll()`](https://developer.mozilla.org/ja/docs/Web/API/Cache/addAll) を使うと指定した複数の URL をすべて fetch して保存することができます。
オフラインでも動作させたいアプリの場合は、サービスワーカーの install イベントの中で `addAll` を実行する以下のようなパターンが一般的です。

```js
self.addEventListener("install", (event) => {
  event.waitUntil(
    self.caches.open("v1").then((cache) => {
      cache.addAll([
        // ページの表示に必要なファイルをすべて列挙する
        "/",
        "/styles.css",
        "/hoge.js",
        "/fuga.js",
        "/assets/piyo.png",
      ]);
    })
  );
});
```

### 保存されているレスポンスを返す

[`Cache.match()`](https://developer.mozilla.org/ja/docs/Web/API/Cache/match) でキャッシュストレージに保存されているレスポンス (のプロミス) を得られます。
一致するものが見つからなかった場合 undefined が返ります。

例えばキャッシュストレージにレスポンスが保存されていればそれを返し、なければ 404 を返すサービスワーカーは以下のように書けます。

:::caution
このアプリはなんらかの理由でキャッシュストレージの内容が削除された場合機能しなくなります。
実用上はすぐ404を返すのではなくサーバーにリクエストを送るようにするのが良いでしょう。
:::

```js
self.addEventListener("fetch", (event) => {
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
```

キャッシュストレージはキャッシュという名前ですが時間経過で自動的に削除されるというような機能はありません。ただのストレージです。
そのため上の例のように install イベントでページと静的アセットをすべて保存して、 fetch イベントで常にそれをレスポンスとして返すようにした場合、ウェブサイトを更新してもクライアント側では永遠に更新されないことになります。
したがって定期的にキャッシュを更新する仕組みを実装する必要があるでしょう。
あるいは、サービスワーカーの js ファイルが更新されれば install イベントが再度実行されキャッシュが新しくなるため、ウェブサイトを更新する際に毎回サービスワーカーの js ファイルも更新するようにするという対策もあります。
