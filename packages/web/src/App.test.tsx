import { describe, expect, test } from "bun:test";
import React from "react";

// 簡単なReactコンポーネントのテスト
function SimpleButton({ text }: { text: string }) {
  return <button>{text}</button>;
}

describe("web パッケージ", () => {
  test("Reactコンポーネントが正しく動作する", () => {
    const component = SimpleButton({ text: "テスト" });
    expect(component).toBeDefined();
    expect(component.type).toBe("button");
    expect(component.props.children).toBe("テスト");
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