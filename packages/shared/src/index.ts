// 依存関係を確認するための簡単な関数

export function checkDependency(): string {
  return "sharedパッケージから正常に読み込まれました";
}

export function getSharedVersion(): string {
  return "1.0.0";
}

export function isSharedLoaded(): boolean {
  return true;
}
