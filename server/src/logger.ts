import winston from "winston" ; //winstonを読み込み

const logLevel = process.env.LOG_LEVEL ?? "info" ; //ログレベルを取得,未設定ならinfoを使う

// logger作成
export const logger = winston.createLogger({
    level: logLevel,
    // フォーマット作成
    format: winston.format.combine(
        // 日付のフォーマット
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        // 最終的なログの形　例）[2026-02-11 09:32:15] ERROR: invalid query parameter
        winston.format.printf(({ timestamp, level, message })=>{
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
        ),
    transports: [
        new winston.transports.Console()
        ]
    
    
});