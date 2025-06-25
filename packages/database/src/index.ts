// データベースパッケージ - 依存関係確認用の関数
import { checkDependency, getSharedVersion } from "@monorepo/shared";

export function getDatabaseInfo(): {
  package: string;
  version: string;
  dependencies: {
    shared: {
      status: string;
      version: string;
    };
  };
} {
  return {
    package: "database",
    version: "1.0.0",
    dependencies: {
      shared: {
        status: checkDependency(),
        version: getSharedVersion(),
      },
    },
  };
}

export function getDatabaseStatus(): string {
  return "データベースパッケージが正常に動作中";
}

export function checkDatabaseConnection(): boolean {
  // 実際のデータベース接続のシミュレーション
  return true;
}
