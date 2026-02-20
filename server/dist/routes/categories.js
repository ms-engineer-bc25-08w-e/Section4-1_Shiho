"use strict";

// categories用のAPIルーターをまとめて定義
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();

// GET /categories
router.get("/", (req, res) => {
    // categoriesにアクセスしたときの処理
    const type = req.query.type;
    // typeが無い場合全カテゴリを返す
    if (type === undefined) {
        return res.json(categories);
    }
    ;
    if (typeof type !== "string" || (type !== "income" && type !== "expense" && type !== "both")) {
        return res.status(400).json({
            error: {
                code: "INVALID_QUERY",
                message: "Invalid parameter",
                details: {
                    type: { type },
                    response: "type out of range"
                },
            },
        });
    }
    const filtered = categories.filter((c) => c.type === type); // array.filter(条件):配列専用。trueになった要素だけを集めて新しい配列を返す
    return res.json(filtered);
});
exports.default = router;
