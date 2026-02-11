// APIサーバーが生きているか確認するための最小ルーターを定義する

import { Router } from "express"; // Expressが提供するRouter機能を読み込む

const router = Router(); // health用の専用ルーターを1つ作成

router.get("/",(_req, res) => { // "/":起点、_req:リクエスト情報（今回は使わないので_を付ける）、res:レスポンス
    res.json({ok: true});
});

export default router;