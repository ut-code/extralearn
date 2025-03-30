---
title: 変数・関数の名前の付け方
---

# 一般に適用されるルール

## 名前は英語で

変数名は英語でつけよう。

```js
// BAD
const namae = "ut.code();"
const setsuritsu = 2019;

// GOOD
const name = "ut.code();" 
const establishedAt = 2019;
```

## 変数は名詞、関数は動詞

変数は名詞の、関数は動詞の名前をつけよう。

```js
// BAD
const pay = 100;
function taxCalculator() {
  return pay * 0.1;
}

// GOOD
const paid = 100;
function calculateTax() {
  return paid * 0.1;
}
```

関数を変数として扱う場合はどちらでもよいので、しっくり来る方にしよう。

```js
// callbackFn は関数だが名詞のほうが自然
function sleep(ms: number, callbackFn: () => void) {
  setTimeout(() => {
    callbackFn();
  }, ms);
}
```

## 変数の長さ

スコープの大きいもの = 広い範囲で使われているもの、例えば `export` されている変数・関数などはなるべく詳細な名前をつけよう。

一方、スコープの小さいもの (`for` 文の中でしか使わないとか) はそこまで説明的な名前をつける必要はないよね。

```js
// BAD: これを import して使うときのことを考えよう
export const w = 8;

// BAD: 意味のない頭文字はやめよう
let wscore = 0;
// BAD: スコープが狭いのに長過ぎるのは逆に悪影響
for (let currentXAxisLoopIndex = 0; currentXAxisLoopIndex < h; currentXAxisLoopIndex++) {
  wscore += board[currentXAxisLoopIndex] === "w" ? 1 : -1;
}

// GOOD
export const boardWidth = 8;

let whiteScore = 0;
// GOOD
for (let x = 0; x < boardWidth; x++) {
  whiteScore += board[x] === "w" ? 1 : -1;
}
```

## 名前の省略

一般に広まっている省略記法以外の名前は省略しないで書こう。

```ts
// GOOD: fn は有名な省略です
const callbackFn = () => {};

// BAD: BE とはなんですか？
const BEConnection = new WebSocket();
```

## クラス・型は大文字始まりにしよう

大文字始まり・大文字つなぎのことを「パスカルケース」ということもあるよ。

```ts
// BAD
class user {
  name: string;
}
type user = { name: string };

// GOOD
class User {
  name: string;
}
type User = { name: string };
```

# JavaScript/TypeScript でのルール

## 変数は大文字つなぎにしよう

小文字始まり・大文字つなぎのことを「キャメルケース」ということもあるよ。

(Java|Type)Script 以外では、例えば

- SQL だとアンダースコア (`_`) つなぎ
- CSS だとハイフン (`-`) つなぎ

が一般的だったりするよ。

```js
// BAD
const user_name = "たつひこ";

// GOOD
const userName = "たつひこ";
```

## Enum や string リテラルの Union をうまくつかおう

TypeScript 限定だけれど、Enum や string のリテラル型の union (`|`)を使うと複数の可能性をうまく表現できるよ。

```ts
// BAD
const todoStateFlag = -1;
const todoState: string = "completed";

// GOOD
const todoState: "planned" | "completed" | "deleted" = "completed";
enum TodoState {
  planned = 0;
  completed = 1;
  deleted = 2;
}
const todoState = TodoState.completed;
```

# 細かい変数名の考え方

## 複数あるものは複数形に

複数を許容するもの (配列や `Map` など) は、複数形の名前をつけよう。

もし今一個しかないとしても複数形にしよう！

```js
// BAD
const user = [
  {
    name: "ゆうと",
  }
];
const userArray = [
  {
    name: "ゆうと",
  },
];

// GOOD
const users = [
  {
    name: "ゆうと",
  }
];
```

## はい/いいえで答えられるように書こう

はい/いいえで答えられるもの (`boolean` 型の変数など) は、はい/いいえで答えられる形式で書こう。

そうすると `is~`、`has~`、`should~` みたいな感じの変数名になることが多いね。

```js
// BAD
const userExistFlag = users.some((user) => user.name === "しょうご");
const totalPrice = items.map((item) => {
  // BAD
  const reduceTaxFlag = item.kind === "grocery";
  return item.price * (reduceTaxFlag ? 1.08 : 1.1);
}).sum();

// GOOD
const userAlreadyExists = users.some((user) => user.name === "しょうご");
const totalPrice = items.map((item) => {
  // GOOD
  const hasReducedTax = item.kind === "grocery";
  return item.price * (hasReducedTax ? 1.08 : 1.1);
}).sum();
```

## オブジェクトのプロパティ名

プロパティ/カラムの名前は、もとのオブジェクトとの関係がわかりやすいように書こう。

```js
const car = {
  name: "Prius",
  person: "Tanaka", // BAD: person は car の何ですか？
  year: 2020, // BAD: year は何の年ですか？
};

const car = {
  name: "Prius",
  owner: "Tanaka", // GOOD: car の所有者だということが分かりやすい
  builtYear: 2020, // GOOD: 車が作られた年だということが分かりやすい
};
```
