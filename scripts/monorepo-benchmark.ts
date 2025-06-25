#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";
import { $ } from "bun";

interface BenchmarkScenario {
  name: string;
  description: string;
  run: () => Promise<number>;
}

interface BenchmarkResults {
  timestamp: string;
  bunVersion: string;
  scenarios: {
    [key: string]: {
      time: number;
      success: boolean;
    };
  };
}

async function measureTime(fn: () => Promise<void>): Promise<number> {
  const start = performance.now();
  await fn();
  return Math.round(performance.now() - start);
}

async function ensureCleanState() {
  console.log("🧹 環境をクリーンアップ中...");
  try {
    await $`rm -rf node_modules bun.lock .turbo`.quiet();
    // packages配下のファイルを個別に削除
    const packages = await $`ls packages`.text();
    for (const pkg of packages.trim().split("\n").filter(Boolean)) {
      await $`rm -rf packages/${pkg}/node_modules packages/${pkg}/dist packages/${pkg}/.next packages/${pkg}/.turbo`.quiet();
    }
  } catch {
    // エラーは無視
  }
}

async function warmupCache() {
  console.log("🔥 キャッシュウォームアップ中...");
  await $`bun install`.quiet();
  await $`bun run build`.quiet();
}

const scenarios: BenchmarkScenario[] = [
  {
    name: "cold_install",
    description: "初回インストール（キャッシュなし）",
    run: async () => {
      await ensureCleanState();
      return measureTime(async () => {
        await $`bun install`.quiet();
      });
    },
  },
  {
    name: "warm_install",
    description: "2回目インストール（キャッシュあり）",
    run: async () => {
      await $`rm -rf node_modules`;
      // packages配下のnode_modulesを削除
      const packages = await $`ls packages`.text();
      for (const pkg of packages.trim().split("\n").filter(Boolean)) {
        await $`rm -rf packages/${pkg}/node_modules`.quiet();
      }
      return measureTime(async () => {
        await $`bun install`.quiet();
      });
    },
  },
  {
    name: "add_dependency",
    description: "新規依存関係追加",
    run: async () => {
      return measureTime(async () => {
        await $`bun add -D @types/node`.quiet();
      });
    },
  },
  {
    name: "cold_build",
    description: "初回ビルド（キャッシュなし）",
    run: async () => {
      await $`rm -rf .turbo`;
      // packages配下のdistと.turboを削除
      const packages = await $`ls packages`.text();
      for (const pkg of packages.trim().split("\n").filter(Boolean)) {
        await $`rm -rf packages/${pkg}/dist packages/${pkg}/.turbo`.quiet();
      }
      return measureTime(async () => {
        await $`bun run build`.quiet();
      });
    },
  },
  {
    name: "warm_build",
    description: "2回目ビルド（turboキャッシュあり）",
    run: async () => {
      return measureTime(async () => {
        await $`bun run build`.quiet();
      });
    },
  },
  {
    name: "single_package_change",
    description: "単一パッケージ変更後のビルド",
    run: async () => {
      // sharedパッケージを変更
      const filePath = path.join(process.cwd(), "packages/shared/src/index.ts");
      const content = await fs.promises.readFile(filePath, "utf-8");
      await fs.promises.writeFile(filePath, `${content}\n// Benchmark change`);

      return measureTime(async () => {
        await $`bun run build`.quiet();
      });
    },
  },
  {
    name: "test_all",
    description: "全テスト実行",
    run: async () => {
      return measureTime(async () => {
        await $`bun test || true`.quiet();
      });
    },
  },
  {
    name: "test_single_package",
    description: "単一パッケージのテスト",
    run: async () => {
      return measureTime(async () => {
        await $`cd packages/shared && bun test`.quiet();
      });
    },
  },
  {
    name: "typecheck",
    description: "型チェック",
    run: async () => {
      return measureTime(async () => {
        await $`bun run typecheck || true`.quiet();
      });
    },
  },
  {
    name: "lint",
    description: "Lintチェック",
    run: async () => {
      return measureTime(async () => {
        await $`bun run lint:fix`.quiet();
      });
    },
  },
  {
    name: "dev_server_startup",
    description: "開発サーバー起動時間",
    run: async () => {
      const CLEANUP_WAIT = 100; // クリーンアップ待機時間
      
      const totalTime = await measureTime(async () => {
        const proc = Bun.spawn(["bun", "run", "dev"], {
          cwd: path.join(process.cwd(), "packages/web"),
          stdout: "pipe",
          stderr: "pipe", // エラー出力もパイプで捕捉
        });

        // "Local:" が出力されるまで待機
        const reader = proc.stdout.getReader();
        let output = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          output += new TextDecoder().decode(value);
          if (output.includes("Local:")) {
            // サーバーが完全に起動してから少し待機
            // Viteの依存関係スキャンが開始されるのを待つことで、
            // エラーメッセージを回避
            await new Promise(resolve => setTimeout(resolve, CLEANUP_WAIT));
            
            // より優雅にサーバーを終了
            proc.kill("SIGTERM");
            
            // プロセスが完全に終了するまで待機
            await proc.exited;
            break;
          }
        }
      });
      
      // 待機時間を差し引いて実際の起動時間を返す
      return totalTime - CLEANUP_WAIT;
    },
  },
];

async function main() {
  console.log("📊 Bun モノレポベンチマーク開始\n");

  // Bunバージョン取得
  const bunVersion = (await $`bun --version`.text()).trim();

  const results: BenchmarkResults = {
    timestamp: new Date().toISOString(),
    bunVersion,
    scenarios: {},
  };

  // 初期セットアップ
  await warmupCache();

  // 各シナリオを実行
  for (const scenario of scenarios) {
    console.log(`\n🏃 ${scenario.description}...`);
    try {
      const time = await scenario.run();
      results.scenarios[scenario.name] = {
        time,
        success: true,
      };
      console.log(`✅ 完了: ${time}ms`);
    } catch (error) {
      results.scenarios[scenario.name] = {
        time: -1,
        success: false,
      };
      console.error(`❌ 失敗:`, error);
    }
  }

  // 結果を保存
  const resultsDir = path.join(process.cwd(), "benchmark-results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const resultFile = path.join(resultsDir, `${timestamp}.json`);
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));

  // 結果表示
  console.log("\n📊 ベンチマーク結果:");
  console.log("=".repeat(60));
  console.log(`Bun バージョン: ${bunVersion}`);
  console.log(`実行日時: ${new Date().toLocaleString("ja-JP")}`);
  console.log("=".repeat(60));

  const maxNameLength = Math.max(
    ...Object.entries(results.scenarios).map(
      ([name]) =>
        scenarios.find((s) => s.name === name)?.description.length || 0,
    ),
  );

  for (const [name, result] of Object.entries(results.scenarios)) {
    const scenario = scenarios.find((s) => s.name === name);
    if (scenario && result.success) {
      console.log(
        `${scenario.description.padEnd(maxNameLength)} : ${result.time
          .toString()
          .padStart(6)} ms`,
      );
    }
  }

  console.log("\n💾 詳細な結果を保存しました:", resultFile);

  // クリーンアップ
  // 最後にクリーンな状態に戻す
  await ensureCleanState();
  await $`bun install`.quiet();

  console.log("\n✨ ベンチマーク完了！");
}

main().catch(console.error);
