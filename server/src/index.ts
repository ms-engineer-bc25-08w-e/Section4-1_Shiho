import "dotenv/config"; // .envに書いた環境変数を読み込むためのライブラリ
import { createApp } from "./app"; // ./app.tsのExpressアプリを組み立てる処理を読み込む
import { logger } from "./logger"; // 動作確認用

const app = createApp();

const port = Number(process.env.PORT ?? 4000); //process.env.PORT=.envから取得、?? 4000=PORTが未設定なら4000を使う

// app.listen(port, () => {
//   console.log(`API server listening on http://localhost:${port}`); // 指定したポートでHTTPサーバーを起動する
// });

app.listen(port, () => {
  logger.info(`API server listening on http://localhost:${port}`); // 指定したポートでHTTPサーバーを起動する
});
