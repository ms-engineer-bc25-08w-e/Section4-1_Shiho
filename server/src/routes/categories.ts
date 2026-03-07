// categories用のAPIルーターをまとめて定義

import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /categories
router.get("/", async(_req, res, next) => { // "/":起点、req:リクエスト情報、res:レスポンス

    try {
        const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
        // フロントが配列期待なら配列で返す
        return res.json(items);
        } catch (e) {
            next(e);
        }

});

export default router;