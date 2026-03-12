// エラー型共通化
export type AppErr = Error & { status?: number; code?: string; details?: unknown};