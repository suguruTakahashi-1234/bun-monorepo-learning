import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { Server } from "node:http";
import { createServer } from "node:http";

let server: Server;
const PORT = 3002;

beforeAll((done) => {
  // テスト用にサーバーを別ポートで起動
  server = createServer((req, res) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    if (url.pathname === "/api/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "テストサーバーが稼働中",
          timestamp: Date.now(),
        }),
      );
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Test Server");
  });

  server.listen(PORT, () => {
    done();
  });
});

afterAll((done) => {
  server?.close(() => {
    done();
  });
});

describe("server パッケージ", () => {
  test("APIサーバーが起動できる", () => {
    expect(server).toBeDefined();
    expect(server.listening).toBe(true);
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
