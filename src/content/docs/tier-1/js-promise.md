---
title: async / await とプロミスオブジェクト
---

## プロミスオブジェクト

JavaScript で非同期的な処理を扱うために提供されている、 `Promise` API というものがあります。

Promise のインスタンスには、３つの状態があります。

- `pending`: 処理待ち中。処理が終わると下の２つのいずれかに移行します。
- `fulfilled`: 処理が成功した状態。
- `rejected`: 処理が失敗した状態。

早速 Promise を作ってみましょう。

```ts title="script1.ts"
const promise = fetch("https://www.google.com");
console.log(promise);
```

```bash
$ bun run ./script1.ts
Promise { <pending> }
```

## プロミスの基本メソッド

Promise が `fulfilled` になった後に実行するコードを登録するために、`then` メソッドを使います。

```ts title="script2.ts" {3..5}
const promise = fetch("https://www.google.com");

promise.then((resp) => {
  console.log(resp);
});
```

```bash
$ bun run ./script2.ts
Response (7.48 KB) {
  ok: true,
  url: "http://www.google.com/",
  status: 200,
  statusText: "OK",
  headers: Headers { /* 省略 */ },
  redirected: false,
  bodyUsed: false,
}
```

Promise が `rejected` になった後に実行するコードを登録するために `catch` メソッドを使います。

```ts title="script3.ts" {3..5} "not-exists"
const promise = fetch("https://not-exists.google.com");

promise.catch((err) => {
  console.log(err);
});
```

```bash
$ bun run ./script3.ts
error: Unable to connect. Is the computer able to access the url?
  path: "https://not-exists.google.com/",
 errno: 0,
  code: "ConnectionRefused"
```

<details>
<summary>
Promise のコンストラクター
</summary>
ここまでは、 Fetch API で作られた Promise オブジェクトに操作をしてきました。自分で Promise オブジェクトを作ることもできます。

```ts title="script4.ts"
const p1 = new Promise((resolve, _reject) => {
  resolve(1);
});
p1.then(console.log);

const p2 = Promise.resolve(2);
p2.then(console.log);

const p3 = Promise.reject(3);
p3.catch(console.log);

const { promise: p4, resolve } = Promise.withResolvers();
p4.then(console.log);
resolve(4);
```

```bash
$ bun run ./script5.ts
1
2
3
4
```
</details>

:::tip[プロミスチェーン]
`then` や `catch` メソッドはそれぞれ新しいプロミスオブジェクトを返すので、複数繋げて非同期な処理の流れを記述することができます。

```ts title="script5.ts"
fetch("https://www.google.com")
  .then((resp) => {
    console.log("got status", resp.status);
    return resp.json(); // この Promise が Reject するので、
  })
  // この then は実行されない
  .then((json) => {
    console.log("got json", json);
  })
  .catch((err) => {
    console.log("got error", err);
  });
```

```bash
$ bun run ./script4.ts
got status 200
got error SyntaxError: Failed to parse JSON
```
:::

## `async` と `await`

さて、お待ちかねの `async` / `await` です。

`async` キーワードを関数の宣言時につけることで、関数の内部で `await` というキーワードが使えるようになります。

`await` キーワードは、 Promise オブジェクトのような `then` メソッドをもつものを、同期関数と同じような書き方で書けるようにする糖衣構文 (Syntax Sugar) です。

```ts title="script6.ts" "async" "await"
async function main() {
  try {
    const res = await fetch("https://www.google.com");
    console.log("got status", res.status);
    const json = await res.json();
    console.log("got json", json);
  } catch (err) {
    console.log("got error", err);
  }
}
main();
```

`await` 自体にエラーハンドリングの仕組みは付属しないので、`catch` メソッドに代わるものとして `try ~ catch` を使います。

:::tip[ESM と Top-Level Await]

EcmaScript Modules を使う場合、トップレベルで `await` を使えるため、上のように `main` 関数を定義する必要もなくなります。 

```ts
try {
  const res = await fetch("https://www.google.com");
  console.log("got status", res.status);
  const json = await res.json();
  console.log("got json", json);
} catch (err) {
  console.log("got error", err);
}
```
<details>
<summary>
ESM の例
</summary>

- `<script>` タグの属性に `type="module"` とある
- 拡張子が `.mjs`, `.mts` である
- package.json に `"type": "module"` とある
- Bun ランタイムで実行される

</details>
:::
