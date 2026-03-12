import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { AppErr } from "../types/appError"; 


// エラーハンドラは(err, req, res, next)が必須
export function errorHandler(
    err: AppErr,
    req: Request,
    res: Response,
    _next: NextFunction
){
    const requestId = req.requestId ?? "-"; // ??:左がnullまたはundefinedなら右を使う

    // ログ出力
    logger.error(`rid=${requestId} ${err.message}`,{
        code: err.code,
        status: err.status,
        details: err.details,
        stack: err.stack
    });

    // レスポンス形式
    // err.statusがある時はそれを使う、err.statusがundefinedまたはnullの時500を使う
    res.status(err.status ?? 500).json({
        error: {
            code: err.code ?? "INTERNAL_SERVER_ERROR",
            message: err.message ?? "Unexpected error occurred", // 予期しないエラーが発生しました
            details: err.details,
            requestId
        }
    });
}