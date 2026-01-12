---
title: 3. Nix 式
---

# Nix 式

## `nix repl`

Nix CLI には、 REPL (Read-Eval-Print Loop = ブラウザのコンソールのように対話形式で実行する形式) が用意されています。

```sh
nix repl
```

## REPL から退出

`ctrl` + `D` で REPL を閉じます。

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
# -> 6
```

文字列

```nix
# JavaScript と違い、 `'` 単体で文字列を囲むことはできない
"hello, " + "nix"
# -> "hello, nix"
```
```nix
# 複数行使う場合は `''` でかこむ
''
multi-line
string
''
# -> "multi-line\nstring\n"
```

リスト

```nix
[ 1 2 ]
# -> [ 1 2 ]
```

```nix
# 結合
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

式に名前をつけることができます。なお、Nix は関数型言語なので、名前のついた式の変更はできません。

```nix
let
  a = 3;
in a + 2;
# -> 5
```

続けて書くことも、 `let` の中の他のメンバーを参照することもできます。

```nix
let
  b = a + 2; # 先の式も参照できる
  a = 3;
in a + b
# -> 8 (3 + 2 + 3)
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

attribute (プロパティ) には、 `.` でアクセスすることができます。

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

アクセスする変数を評価時に決めたい場合は、 Interpolation `${}` を使います。

```nix
let
  attrs = {
    a = 1;
    b = 2;
  }
  key = "b";
in
  attrs.${key} # -> 2
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

Nix で関数は、`引数: 返り値` という形で作ります。

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

Nix の関数は引数を一つしかとれないので、複数の引数をとる関数を定義する場合は、Attrset を使うか、複数回呼び出すようにします。

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
# 複数回呼び出す関数 (カリー化と言ったり言わなかったりする)
let
  # 返り値をもう一度呼び出して解を得る
  add = a: b: a + b;
in
  add 2 3
  # -> 5
```

`map` のような高階関数もたくさんあります。

```nix
builtins.map (x: x * 2) [1 2 3]
# -> [ 2 4 6 ]
```

## パス

Nix では、パスも基本型の一つです。

(前準備: `path.txt` というファイルを作業ディレクトリに作成し、`hello path` と書き込んでおいてください。)

```nix
builtins.readFile ./path.txt
# -> "hello path\n"
```
