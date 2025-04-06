import * as t from "bun:test";
import { askName } from "./ask-name";
const { test, expect, describe } = t;

test("askName", () => {
  t.spyOn(globalThis, "prompt").mockImplementation(() => "aster-void");
  expect(askName()).toEqual("aster-void");

  describe("it does not console.error if user's name is empty string", () => {
    t.spyOn(globalThis, "prompt").mockReturnValueOnce("");
    t.spyOn(console, "error").mockImplementation(() => {
      throw new Error("unexpected console.error call");
    });
  });
  expect(askName()).toEqual("");
});
