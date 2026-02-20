// デバッグログ用

import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export function debugLog (req: Request, _res: Response, next: NextFunction){
    const requestId = (req as any).requestId ?? "-"; // ??:左がnullまたはundefinedなら右を使う
    logger.debug(`query rid=${requestId}: ${JSON.stringify(req.query)}`) ;// パラメータの中身をログに出す、JSON.stringify():文字列に変換

    next();
};