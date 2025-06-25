import {
  checkDatabaseConnection,
  getDatabaseInfo,
  getDatabaseStatus,
} from "@monorepo/database";
import { checkDependency, getSharedVersion } from "@monorepo/shared";

const server = Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/dependencies") {
      return new Response(
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
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (url.pathname === "/api/status") {
      return new Response(
        JSON.stringify({
          message: "APIサーバーが稼働中",
          timestamp: Date.now(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      "API Server - /api/dependencies で依存関係を確認できます",
    );
  },
});

console.log(`APIサーバーが起動しました: http://localhost:${server.port}`);
console.log(`依存関係を確認: http://localhost:${server.port}/api/dependencies`);
