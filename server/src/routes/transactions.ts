// transactions用のAPIルーターをまとめて定義

import { Router } from "express";
import { IncExpBase } from "../incExp";
import { logger } from "../logger";

const router = Router();

type Transaction = { 
    id: string,
    date: string,
    type: IncExpBase,
    categoryId: string,
    categoryName: string,
    title: string,
    amount: number
    } ;


//DBの代わりのダミーデータ
const transactions: Transaction[] = [{
    id: "t_001",
    date: "2025-12-24",
    type: "expense",
    categoryId: "c_food",
    categoryName: "食費",
    title: "スーパー",
    amount: 1000
},
{
    id: "t_002",
    date: "2025-12-25",
    type: "income",
    categoryId: "c_salary",
    categoryName: "給与",
    title: "12月給与",
    amount: 250000
 }
];

// エラー型
type AppErr = Error & { status?: number; code?: string; details?: unknown};

// エラー作成
function createError(status: number, code: string, message: string, details?: unknown): AppErr{
    const err: AppErr = new Error(message);
    err.status = status;
    err.code = code;
    err.details = details;
    return err;
}

// GET /transactions
router.get("/",(req, res, next) => {
    try{   
        logger.debug("Get /transactions called") // 「/transactions が呼ばれましたよ」というログを出す
        logger.debug(`query: ${JSON.stringify(req.query)}`) // パラメータの中身をログに出す、JSON.stringify():文字列に変換

    // テスト用：error=trueの場合は強制エラー
    // if(req.query.error === "true"){
    //     const err = createError(
    //         500, 
    //         "TEST_ERROR", 
    //         "Intentional error for testing",
    //         {query: req.query}
    //     );
    //     return next(err);
    // }

    const { month, type, categoryId} = req.query;
    // Express + TypeScript では req.queryの型は最初から以下の通り定義されている
    // string | string[] | ParsedQs | ParsedQs[] | undefined

    // typeチェック
    if(type !== undefined && type !== "income" && type !== "expense"){
        return next(
            createError(400,"INVALID_QUERY","Invalid parameter",
                {
                    type,
                    response: "type out of range"
                }
            )           
        );
    };

    // monthチェック
    // typeof:値の型を返す（型チェックしないと正規表現でエラーになる）
    // 正規表現:^→先頭、\d{4}→数字4桁（年）、-→ハイフン、\d{2}→数字2桁（月）、$→末尾
    // 正規表現.test(文字列):正規表現のメソッド、monthがYYYY-01~12形式かをチェック
    if(month !== undefined && (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/ .test(month))){
        return next(
            createError(400, "INVALID_QUERY", "Invalid parameter",{
                month,
                response: "month out of range"
            })         
        );
    };

    // categoryIdチェック
    if(categoryId !== undefined && typeof categoryId !== "string"){
        return next(
            createError(400, "INVALID_QUERY", "Invalid parameter",{
                categoryId,
                response: "categoryId out of range"
            })          
        );
    };

    // transactions（全取引データ）から条件に合うものだけを取り出してitemsにする
    const items = transactions.filter(

        // t:1件の取引
        (t) => {
            // income / expenseが一致しなければ除外
            if (typeof type === "string" && t.type !== type){
                return false;
            }
            // 文字列.startsWith(検索文字列 [, 開始位置]) t.dateがそのmonthで始まらなければ除外
            if (typeof month === "string" && !t.date.startsWith(month)) {
                return false;
            };
            if (typeof categoryId === "string" && t.categoryId !== categoryId){
                return false;
            }
            // どの条件にも引っかからなかった取引はitemsに含める
            return true;
            
        }
    );

    return res.json({items, count: items.length});

    } catch (err) {
        next(err);
    }
}
);

// GET /transactions/:id
router.get("/:id",(req, res, next) => {
    const { id } = req.params;

    const found = transactions.find((t) => t.id === id);

    if(!found) {
        return next(
            createError(404, "NOT_FOUND", "transaction not found",{
                id,
                response: "The specified transaction does not exist"
            })
        );
    }
    return res.json(found);
});

export default router;