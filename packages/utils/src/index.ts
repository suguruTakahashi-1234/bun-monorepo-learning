// 共通ユーティリティ関数

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
