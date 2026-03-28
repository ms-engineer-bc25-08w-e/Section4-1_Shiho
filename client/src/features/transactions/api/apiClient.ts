// import { json } from "stream/consumers";
import { ApiError, type ApiErrorBody } from "./apiError";
import type { Transaction, Draft } from "@/features/transactions/types/transaction";

// API接続先URL 環境変数があればそれを使うなければlocalhostを使う
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// async function:非同期関数、apiFetch<T>:このAPIが返すデータの型を呼び出す側で指定できる
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init, // initの中身をここに展開
    headers: {
      "Content-Type": "application/json", // JSON形式で送るとサーバーに伝える
      ...(init?.headers ?? {}), // initがあればheadersを読む、なければundefined
    },
    cache: "no-store", // キャッシュを格納しない
  });

  // 204,205はbody無しなのでJSONを読まない
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  if (res.ok) return (await res.json()) as T;

  let body: ApiErrorBody | null = null;
  try {
    body = (await res.json()) as ApiErrorBody; // エラーレスポンスもJSONかもしれないからとりあえず読んでみる
  } catch {
    // JSONじゃない場合(APIが必ずJSONを返すとは限らないから必要)
  }

  // fetch後のレスポンスエラー処理のあるあるパターン
  if (body?.error?.code && body?.error?.message) {
    //?. :もしそれが存在していたらアクセスする(bodyがあるか？body.errorがあるか？body.error.codeがあるか？)

    throw new ApiError(res.status, body); // サーバーが正しい形式でエラーを返した場合
  }

  throw new Error(`Request failed: ${res.status}`); // 想定外のエラー
}

// 更新用

export async function updateTransaction(id: string, draft: Draft): Promise<Transaction> {
  return await apiFetch<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
}
