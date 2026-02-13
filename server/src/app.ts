//Expressアプリに共通設定を行いURLごとにルーターを割り当てる場所


import express from "express"; // APIサーバーを作るためのフレームワーク本体
import cors from "cors"; // 別ポート・別ドメインからのアクセスを許可

import healthRouter from "./routes/health"; // 死活監視（ヘルスチェック）用
import categoriesRouter from "./routes/categories";
import transactionsRouter from "./routes/transactions"

import { requestId } from "./middlewares/requestId"; // 後続のログでrequestIdを使うため初めに書く
import { accessLog } from "./middlewares/accessLog";
import { debugLog } from "./middlewares/debugLog";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
    const app = express() ; // Express（サーバ本体）を生成。今後「起動」と「設定」をわける為関数にするのがメジャー。

    app.use(express.json()); // JSON形式のリクエストボディを読み取れるようにする

    app.use(cors()); // client（3000） → server（4000）の通信を可能にする

    // ログ系はルーティングより前に記述する必要がある
    app.use(requestId);
    app.use(accessLog);
    app.use(debugLog);

    app.use("/health",healthRouter); // /healthで始まるURLはhealthRouterに任せる
    app.use("/categories",categoriesRouter) // /categoriesで始まるURLはcategoriesRouterに任せる
    app.use("/transactions",transactionsRouter) // /transactionsで始まるURLはtransactionsRouterに任せる

    app.use(errorHandler); // エラーハンドラ最後の保険

return app; // 完成したExpressアプリを外に渡す

}


// イメージ
// [ request ]
//      ↓
// [ requestId ]
//      ↓
// [ accessLog ]
//      ↓
// [ debugLog ]
//      ↓
//     ├── /health        → healthRouter
//     ├── /categories    → categoriesRouter
//     └── /transactions  → transactionsRouter
//      ↓
// [ errorHandler ]（エラー時のみ）
//      ↓
// [ response ]
