import { describe, expect, test } from "bun:test";
import { checkDependency, getSharedVersion, isSharedLoaded } from "./index";

describe("shared パッケージ", () => {
  test("checkDependency が正しいメッセージを返す", () => {
    expect(checkDependency()).toBe("sharedパッケージから正常に読み込まれました");
  });

  test("getSharedVersion がバージョンを返す", () => {
    expect(getSharedVersion()).toBe("1.0.0");
  });

  test("isSharedLoaded が true を返す", () => {
    expect(isSharedLoaded()).toBe(true);
  });
});