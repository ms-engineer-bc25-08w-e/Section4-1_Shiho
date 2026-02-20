"use strict";

// APIサーバーが生きているか確認するための最小ルーターを定義する
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Expressが提供するRouter機能を読み込む
const router = (0, express_1.Router)(); // health用の専用ルーターを1つ作成
router.get("/", (_req, res) => {
    res.json({ ok: true });
});
exports.default = router;
