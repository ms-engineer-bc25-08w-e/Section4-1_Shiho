"use strict";

//Expressアプリに共通設定を行いURLごとにルーターを割り当てる場所
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express")); // APIサーバーを作るためのフレームワーク本体
const cors_1 = __importDefault(require("cors")); // 別ポート・別ドメインからのアクセスを許可
const health_1 = __importDefault(require("./routes/health")); // 死活監視（ヘルスチェック）用
const categories_1 = __importDefault(require("./routes/categories"));
const transactions_1 = __importDefault(require("./routes/transactions"));
function createApp() {
    const app = (0, express_1.default)(); // Express（サーバ本体）を生成。今後「起動」と「設定」をわける為関数にするのがメジャー。
    app.use(express_1.default.json()); // JSON形式のリクエストボディを読み取れるようにする
    app.use((0, cors_1.default)()); // client（3000） → server（4000）の通信を可能にする
    app.use("/health", health_1.default); // /healthで始まるURLはhealthRouterに任せる
    app.use("/categories", categories_1.default); // /categoriesで始まるURLはcategoriesRouterに任せる
    app.use("/transactions", transactions_1.default); // /transactionsで始まるURLはtransactionsRouterに任せる
    return app; // 完成したExpressアプリを外に渡す
}
