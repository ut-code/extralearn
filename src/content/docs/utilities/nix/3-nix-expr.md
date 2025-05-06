---
title: 3. Nix 式
---

# Nix 式

## `nix repl`

Nix CLI には、 REPL (Read-Eval-Print Loop = ブラウザのコンソールのように対話形式で実行する形式) が用意されています。

```sh
nix repl
```

## Nix 式評価の基本

Nix 式は、多くの関数型言語と同じように、遅延評価されます。

## 基本的な値

数値

```nix
1
# -> 1
```
```nix
2 * 3
# -> 3
```

文字列

```nix
"hello"
# -> "hello"
```
```nix
"hello, " + "nix"
# -> "hello, nix"
```

配列

```nix
[ 1 2 ]
# -> [ 1 2 ]
```

```nix
[ 1 2 ] ++ [ 3 4 ]
# -> [ 1 2 3 4]
```

論理値

```nix
true
# -> true
```

```nix
!true
# -> false
```

## `let ... in` 構文

いわゆる「変数」を定義できます。なお、Nix は関数型言語なので、変数の変更はできません。

```nix
let
  a = 3;
in a + 2;
# -> 5
```

続けて書くことも、 `let` の中の他のメンバーを参照することもできます。

```nix
let
  b = a + 2;
  a = 3;
in a + b
# -> 8
```

## Attrset

文字列 -> 任意の値の対応を記述するものです。 JavaScript でいうオブジェクトや Map のようなものです。

```nix
{
  a = 1;
  b = 2;
}
# -> { a = 1; b = 2; }
```

もちろん、アトリビュート (プロパティ) にアクセスすることもできます。

```nix
let
  attrset = {
    a = 1;
    b = 2;
  };
in
  attrset.b
# -> 2
```

`rec` キーワードを使うと、自身のメンバーにアクセスできます。

```nix
rec {
  a = 5;
  b = a + 3;
}
# -> { a = 5; b = 8; }
```

## 関数

```nix
# 引数をひとつとる関数
let
  fn = arg: arg + 1;
  # -> «lambda @ «string»:1:1»
in
  # 関数の呼び出し
  fn 2
  # -> 3
```

```nix
# 組み込み関数
toString 2
# -> "2"
```

よくある関数言語のように、Nix の関数は引数を一つしかとれないので、複数の引数をとる関数を定義する場合は、Attrset を使うか「カリー化」をします。

```nix
# attrset をとる例
let
  # 引数を分解することもできる
  add = { a, b }: a + b;
in
  add { a = 2; b = 3; }
  # -> 5
```

```nix
# カリー化する例
let
  # カリー化された関数、二回呼び出して解を得る
  add = a: b: a + b;
in
  add 2 3
  # -> 5
```


:::tip[カリー化とは？]

文字で読むより上の例を見たほうが分かりやすいと思います。
上の例を読んで理解したら、この Tip は読まなくてもいいです。

カリー化とは、わかりやすく言うと、呼び出したときに、その引数を保存した新しい関数を返すことです。

TypeScript で例えるとこのようになります。

```ts
function add(a: number) {
  return (b: number) => a + b;
}

console.log(add(2)(3)); // -> 5

// 部分的に適用することもできる
const curried = add(4);
console.log(curried(5)); // -> 9
```

正確な定義は [Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%AA%E3%83%BC%E5%8C%96) を参照してください。

:::

## パス

Nix では、パスも基本型の一つです。

(前準備: `path.txt` というファイルを作業ディレクトリに作成し、`hello path` と書き込んでおいてください。)

```nix
builtins.readFile ./path.txt
# -> "hello path\n"
```

## REPL から退出

`ctrl` + `D` で REPL を閉じます。
