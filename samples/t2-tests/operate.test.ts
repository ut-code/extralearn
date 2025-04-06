import { test, expect } from "bun:test";
import { operate } from "./index.ts";

test('operate("add")', () => {
  expect(operate("add", [2, 3, 4])).toEqual(9);
  // 基本的な動作の確認は複数回行おう
  expect(operate("add", [6, 6])).toEqual(12);
  expect(operate("add", [2, 3, 4])).toEqual(9);

  // エッジケースに対応しているかどうか確認しよう
  expect(operate("add", [])).toEqual(0);

  // バグが発生したら、テストに reproduction を書いて二度と起こらないようにしよう
  expect(operate("add", [-1, 1])).toEqual(0);
});
