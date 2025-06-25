import { createServer, type Server } from "node:http";
import {
  checkDatabaseConnection,
  getDatabaseInfo,
  getDatabaseStatus,
} from "@monorepo/database";
import { checkDependency, getSharedVersion } from "@monorepo/shared";

const PORT = 3001;

const server: Server = createServer((req, res) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);

  // CORSヘッダーを設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // プリフライトリクエストへの対応
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (url.pathname === "/api/dependencies") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          package: "server",
          version: "1.0.0",
          dependencies: {
            shared: {
              status: checkDependency(),
              version: getSharedVersion(),
            },
            database: {
              info: getDatabaseInfo(),
              status: getDatabaseStatus(),
              connected: checkDatabaseConnection(),
            },
          },
          timestamp: Date.now(),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (url.pathname === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "APIサーバーが稼働中",
        timestamp: Date.now(),
      }),
    );
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("API Server - /api/dependencies で依存関係を確認できます");
});

server.listen(PORT, () => {
  console.log(`APIサーバーが起動しました: http://localhost:${PORT}`);
  console.log(`依存関係を確認: http://localhost:${PORT}/api/dependencies`);
});

export { server, PORT };
