import { Request, Response, NextFunction } from "express"; // req,res,nextの型定義
import crypto from "crypto"; // Node.js標準の暗号機能がついているソフト

export function requestId (req: Request, res: Response, next: NextFunction){
    const id = crypto.randomUUID(); // ランダムな一意IDを生成
    req.requestId = id; // リクエストにrequestIdを追加

    res.setHeader("X-Request-Id", id); // クライアントにもIDを返す=クライアント側のログとサーバ側のログが紐づけられる

    next();
}