---
title: テストの基礎とその重要性
---

## どのようなときに使うか

例えば、以下のような使い方ができるコードを書いたとします。

```ts
import { operate } from "./logic.ts";

operate("add", [2, 3, 4]);
```

すべてのコードは、今後の拡張やバグ修正、リファクタなどで変更される可能性があります。この `operate` 関数も例外ではありません。

では、今後の変更で挙動が変わらないことをどうやって保証すればよいでしょうか？

**テスト**を書くことで、挙動の確認を自動化することができます。

## テストの基本

今回は、`bun:test` を使ってテストを書きますが、他のライブラリも基本的なコードは同じです。

```ts title="operate.test.ts" {3..5}
import { test, expect } from "bun:test";

test('operate("add")', () => {
  expect(operate("add", [2, 3, 4])).toEqual(9);
});
```

```sh
$ bun test
bun test v1.2.8 (adab0f64)

operate.test.ts:
✓ operate("add") [1.00ms]

 1 pass
 0 fail
 1 expect() calls
Ran 1 tests across 1 files. [20.00ms]
```

:::tip

`bun test` は、 `.test.ts` または `_test.ts` で終わるファイルを再帰的に探してそのファイルでテストを実行します。

:::

## 関数のモック

テストしたいコードの中で、参照透過性のないコードの「外」にアクセスすることがあります。

そういうときは、「モック」という機能を使って関数の挙動を模倣して代替することができます。

```ts
import { test, expect, spyOn } from "bun:test";

test("askName", () => {
  spyOn(globalThis, "prompt").mockImplementation(() => "aster-void");
  expect(askName()).toEqual("aster-void");
});
```

## テストのベストプラクティス

```ts
test('operate("add")', () => {
  // 基本的な動作の確認は複数回行おう
  expect(operate("add", [6, 6])).toEqual(12);
  expect(operate("add", [2, 3, 4])).toEqual(9);

  // エッジケースに対応しているかどうか確認しよう
  expect(operate("add", [])).toEqual(0);

  // バグが発生したら、テストに reproduction を書いて二度と起こらないようにしよう
  expect(operate("add", [-1, 1])).toEqual(0);
});
```

## CI パイプラインでのテスト実行

テストは、CI パイプラインで実行すると非常に便利です。

詳細の説明は、CI・CD パイプラインの章に任せます。
