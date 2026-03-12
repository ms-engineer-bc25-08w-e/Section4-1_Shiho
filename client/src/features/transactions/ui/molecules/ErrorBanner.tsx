// APIエラーや予期しないエラーが発生したときに、画面上に赤いエラーバナーを表示する

"use client";

import { ApiError } from "../../api/apiError";

type Props = {error: unknown}; // unknown:型不明だけど何か入ってくる可能性がある

export function ErrorBanner({error}: Props){
    if (!error) return null; // errorがnull/undefined/falseの場合何も描画しない

    if (error instanceof ApiError) { //class ApiErrorだったら
        return (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                <div className="font-semibold">エラー: {error.message}</div>
                <div className="font-semibold mt-1 text-xs text-red-900">
                    code: {error.code} / status: {error.status}
                    {error.requestId ? ` / requestId: ${error.requestId}` : ""}
                    {/* requestIdはある時だけ表示 */}
                </div>
            </div>
        );
    };

    // ApiErrorじゃない場合最低限メッセージを表示する
    // error instanceof Error ?:errorはErrorクラスから作られたオブジェクトか？
    const msg = error instanceof Error ? error.message : String(error);
    return (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            <div className="font-semibold">エラー: {msg}</div>
        </div>
    );

};

