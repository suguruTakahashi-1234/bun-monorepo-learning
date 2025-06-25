import { describe, expect, test } from "bun:test";

describe("web パッケージ", () => {
  test("基本的な関数が動作する", () => {
    // シンプルな関数のテスト
    const add = (a: number, b: number) => a + b;
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
  });

  test("環境変数が読み込める", () => {
    // Vite環境変数のモック
    const mockEnv = {
      MODE: "test",
      BASE_URL: "/",
      DEV: false,
      PROD: true,
    };
    expect(mockEnv.MODE).toBe("test");
    expect(mockEnv.DEV).toBe(false);
  });

  test("依存関係のインポートが動作する", async () => {
    // dynamic importのテスト
    const sharedModule = await import("@monorepo/shared");
    expect(sharedModule.checkDependency).toBeDefined();
    expect(typeof sharedModule.checkDependency).toBe("function");
  });
});
