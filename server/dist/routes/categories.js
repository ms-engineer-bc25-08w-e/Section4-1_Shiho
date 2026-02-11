"use strict";
// categories用のAPIルーターをまとめて定義
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
//DBの代わりのダミーデータ
const categories = [
    { "id": "c_salary", "name": "給与", "type": "income" },
    { "id": "c_food", "name": "食費", "type": "expense" },
    { "id": "c_transpo", "name": "交通費", "type": "expense" },
    { "id": "c_sideinc", "name": "副収入", "type": "income" },
    { "id": "c_entmt", "name": "娯楽", "type": "both" },
    { "id": "c_other", "name": "その他", "type": "both" }
];
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
