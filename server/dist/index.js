"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // .envに書いた環境変数を読み込むためのライブラリ
const app_1 = require("./app"); // ./app.tsのExpressアプリを組み立てる処理を読み込む
dotenv_1.default.config(); // .envを有効化する
const app = (0, app_1.createApp)();
const port = Number(process.env.PORT ?? 4000); //process.env.PORT=.envから取得、?? 4000=PORTが未設定なら4000を使う
app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`); // 指定したポートでHTTPサーバーを起動する
});
