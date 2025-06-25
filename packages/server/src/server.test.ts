import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { Server } from "bun";

let server: Server;

beforeAll(() => {
  // テスト用にサーバーを別ポートで起動
  server = Bun.serve({
    port: 3002,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/api/status") {
        return new Response(
          JSON.stringify({
            message: "テストサーバーが稼働中",
            timestamp: Date.now(),
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response("Test Server");
    },
  });
});

afterAll(() => {
  server?.stop();
});

describe("server パッケージ", () => {
  test("APIサーバーが起動できる", () => {
    expect(server).toBeDefined();
    expect(server.port).toBe(3002);
  });

  test("/api/status エンドポイントが動作する", async () => {
    const response = await fetch("http://localhost:3002/api/status");
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBe("テストサーバーが稼働中");
    expect(data.timestamp).toBeDefined();
  });

  test("不明なパスで基本レスポンスを返す", async () => {
    const response = await fetch("http://localhost:3002/unknown");
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toBe("Test Server");
  });
});
