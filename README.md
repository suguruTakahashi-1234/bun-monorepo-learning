# Bun Workspace モノレポ

Bunのワークスペース機能を使用したモノレポのサンプルプロジェクトです。

## 構造

```
.
├── apps/
│   ├── api/      # APIサーバー（ポート3001）
│   └── web/      # Webアプリケーション
├── packages/
│   ├── ui/       # 共通UIコンポーネント
│   └── utils/    # 共通ユーティリティ関数
└── package.json  # ワークスペース設定
```

## セットアップ

```bash
# 依存関係のインストール
bun install

# すべてのパッケージの開発サーバーを起動
bun dev

# 特定のパッケージのみ実行
bun run --filter @monorepo/web dev
bun run --filter @monorepo/api dev

# ビルド
bun build
```

## ワークスペースの特徴

1. **workspace:*** - パッケージ間の依存関係を自動解決
2. **共通の依存関係** - ルートで管理し、重複を削減
3. **並列実行** - `--filter`で複数パッケージを同時実行
4. **型の共有** - TypeScriptの型を自動で認識

## パッケージ間の依存関係

- `@monorepo/web` → `@monorepo/ui`, `@monorepo/utils`
- `@monorepo/api` → `@monorepo/utils`
