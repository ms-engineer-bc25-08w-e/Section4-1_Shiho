// アクセスログ用

import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export function accessLog (req: Request, res: Response, next: NextFunction){
    const start = Date.now(); // リクエスト開始時刻を記録

    // finishイベント:レスポンスがクライアントに送信完了した瞬間に発火
    res.on("finish", () => {
        const ms = Date.now() - start; // 処理時間を計算
        const requestId = req.requestId ?? "-"; // ??:左がnullまたはundefinedなら右を使う

        // ログ出力
        // req.method:GETorPOST、req.originalUrl:URL、res.statusCode:200・400等、ms:処理時間、rid:リクエストID
        logger.info(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${ms} rid=${requestId}`
        );
    })

    next(); // 処理を次へ渡す
}