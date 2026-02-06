import dotenv from "dotenv"; // .envに書いた環境変数を読み込むためのライブラリ
import { createApp } from "./app"; // ./app.tsのExpressアプリを組み立てる処理を読み込む


dotenv.config(); // .envを有効化する

const app = createApp();

const port = Number(process.env.PORT ?? 4000); //process.env.PORT=.envから取得、?? 4000=PORTが未設定なら4000を使う

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`); // 指定したポートでHTTPサーバーを起動する
});
