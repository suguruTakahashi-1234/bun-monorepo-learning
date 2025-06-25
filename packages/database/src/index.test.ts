import { describe, expect, test } from "bun:test";
import {
  checkDatabaseConnection,
  getDatabaseInfo,
  getDatabaseStatus,
} from "./index";

describe("database パッケージ", () => {
  test("getDatabaseInfo が正しい情報を返す", () => {
    const info = getDatabaseInfo();
    expect(info.package).toBe("database");
    expect(info.version).toBe("1.0.0");
    expect(info.dependencies.shared.status).toBe(
      "sharedパッケージから正常に読み込まれました",
    );
  });

  test("getDatabaseStatus がステータスメッセージを返す", () => {
    expect(getDatabaseStatus()).toBe("データベースパッケージが正常に動作中");
  });

  test("checkDatabaseConnection が true を返す", () => {
    expect(checkDatabaseConnection()).toBe(true);
  });
});
