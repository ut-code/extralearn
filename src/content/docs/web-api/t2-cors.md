---
title: CORS のドメイン指定と Cookie の Domain
---

# CORS (Cross-Origin Resource Sharing) とは？

CORS（クロスオリジンリソース共有）は、異なるオリジン（ドメイン、プロトコル、ポートが異なるリソース）間でのデータのやり取りを制御する仕組みです。

通常、ブラウザはセキュリティ上の理由から、スクリプトが異なるオリジンのリソースを読み取ることを制限します（同一オリジンポリシー = SOP と呼ばれます）。

:::tip

重要なのは、

- **ブラウザ**が
- リソースの**読み取り**

を制限しているということです。なので、リクエストは送信されますし、レスポンスもちゃんと返ってきていて、ネットワークタブを見れば確認できます。

:::

CORS はこの制限を緩和するために利用されます。

### SOP によってブロックされるリソースの例

```ts
const text = await fetch('http://localhost:3000/')
  .then(response => response.text());
```

このコードを `http://localhost:8000/` で実行すると、`http://localhost:3000/` のリソースが CORS ポリシーによりブロックされます。

:::caution

試しに再現して見る場合は、 Chromium 系のブラウザでやるようにしてください。

Firefox ベースのブラウザだと、 localhost での SOP 制限が効かないようです。

:::

## CORS の基本

CORS では、サーバーが `Access-Control` で始まるヘッダーを使用して、どのオリジンからのリソースの読み込みを許可するかをブラウザに指示します。

サーバー側でリソースへの基本的なアクセスを許可するには、`Access-Control-Allow-Origin` を設定します。

```ts {3}
const app = new Hono().get("/", async (c) => {
  c.header("Access-Control-Allow-Origin", "http://localhost:8000");
  return c.text(`text sent from server ${Math.random()}`);
});
```

## Preflight リクエスト

GET / POST メソッドでなかったり、特殊なヘッダーを含むリクエストでは、ブラウザが事前に `OPTIONS` リクエストを送信してサーバーにそのメソッド/ヘッダーを含むリクエストを送信してよいか許可を確認します。

この `OPTIONS` リクエストを Preflight リクエストと呼ぶことがあります。

[Preflight request | MDN](https://developer.mozilla.org/ja/docs/Glossary/Preflight_request)

:::caution

ブラウザの JavaScript からはサーバーの許可がないと送信できませんが、他の方法 (cURL を使うなど) では自由にリクエストを飛ばすことができるので、こんなものはただの飾りです。

:::

### `OPTIONS` リクエストの処理を含めた例

```ts {11..12}
const app = new Hono()
  .get("/", async (c) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    return c.text(`text sent from server ${Math.random()}`);
  })
  .delete("/", async (c) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    return c.text("deleted!");
  })
  .options("/", async (c) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:8000");
    c.header("Access-Control-Allow-Methods", "GET,DELETE");
    return c.body(null);
  });
```

複数オリジンやパターンでオリジンを許可したい場合、 `Access-Control-Allow-Origin` の仕様上直接は記述できないので、こちら側でオリジンを計算して返しましょう。

またその時は、Preflight リクエストがキャッシュされるのを防ぐために、 `Vary: Origin` のヘッダーもつける必要があります。

Hono や Express ではこういうのを自動でやってくれる `cors` ミドルウェアがあるので、学習目的以外ではそっちを使うことが多いですね。

## CORS で多いミス

- スキームを書かずに指定しようとしている
  - `http://localhost:8000` ではなく、 `localhost:8000` と書いている

## まとめ

- CORS は異なるオリジン間の通信を制御する仕組み。
- `Access-Control-Allow-Origin` ヘッダーで許可するオリジンを指定。
- `OPTIONS` リクエスト（プリフライト）が発生する場合もある。
- サーバー側で適切に設定すれば、CORS の問題を解決できる。

この基本を押さえれば、CORS エラーの原因を特定しやすくなります！

## Cookie のドメイン制限

TODO: Cookie のドメイン属性はどこでいつ使われる？

Cookie の `Domain` 属性は、 CORS のドメイン制限と挙動が異なります。

具体的には、

- `Domain` 属性を指定しない場合、全く同じドメインからのリクエストのみ許可 (CORS と同じ)
- `Domain` 属性にドメインを指定する場合、`Domain` で終わるドメインのサブドメインはすべて許可
  - CORS の場合、サブドメインによる指定は不可
- `Domain` 属性に指定できるドメインは、 eTLD + 1 までという制限がある。
  - eTLD とは: effective Top Level Domain = 実質的なトップレベルドメイン
    - `com`, `co.jp`, `pages.dev` のように、共有されていて複数の人がサブドメインを取得できるようなドメイン。
  - つまり、 `api.utcode.net` の場合は `api.utcode.net` `utcode.net` は指定できるが、 `net` は不可能
  - CORS にはない制限。

詳細: [Cookie の送信先の定義 | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/Cookies#cookie_%E3%81%AE%E9%80%81%E4%BF%A1%E5%85%88%E3%81%AE%E5%AE%9A%E7%BE%A9)
