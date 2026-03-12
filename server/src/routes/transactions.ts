// transactions用のAPIルーターをまとめて定義

import { Router } from "express";
import { IncExpBase } from "../incExp";
import { logger } from "../logger";
import { prisma } from "../prisma";
import { Prisma } from "../generated/prisma"; 
import { AppErr } from "../types/appError";


const router = Router();

// エラー作成
function createError(status: number, code: string, message: string, details?: unknown): AppErr{
    const err: AppErr = new Error(message);
    err.status = status;
    err.code = code;
    err.details = details;
    return err;
}

// GET /transactions
router.get("/", async(req, res, next) => { //DB接続するのでasync入れる

    try{   
        logger.debug("Get /transactions called") // 「/transactionsが呼ばれた」というログを出す
        logger.debug(`query: ${JSON.stringify(req.query)}`) // パラメータの中身をログに出す、JSON.stringify():文字列に変換

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
    const where: Prisma.TransactionWhereInput = {}; // where句の型指定

    if (typeof type === "string") where.type = type;

    if (typeof categoryId === "string") where.categoryId = categoryId;

    if (typeof month === "string") {
        const start = new Date(`${month}-01T00:00:00.000Z`); // その月の1日 00:00:00
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1); // getMonth():今月を取得、setMonth(n):月をnに変更

        // date列に対する条件セット
        // Prismaのフィルター構文、gte:>=、lt:<
        where.date = { gte: start, lt:end }; 
    }

    const rows = await prisma.transaction.findMany({
        where,
        orderBy: [{date: "desc"}],
        include: {category: true},
    });

    const items = rows.map((t) => ({
        id: t.id,
        date: t.date.toISOString().slice(0, 10), // .toISOString():Date→ISO形式の文字列に変換する
        type: t.type as IncExpBase, // 独自の型の為型を明示的に指定
        categoryId: t.categoryId,
        categoryName: t.category.name,
        title: t.title,
        amount: t.amount,
    })   
    );

    // イメージ
    // Prisma.findMany()
    //         ↓
    //    SQL 実行
    //         ↓
    // rows（DB結果）
    //         ↓
    // map() (データ加工)
    //         ↓
    // items（整形済データ）
    //         ↓
    // res.json()

    return res.json({items, count: items.length});
    } catch (err) {
        next(err);
    }
}
);

// GET /transactions/:id
router.get("/:id",async(req, res, next) => {
    try {
        const { id } = req.params;

        const t = await prisma.transaction.findUnique ({ // PrimaryKeyやUniqueのカラムをWHERE句に指定してデータを取得する場合はfindUniqueを使用する必要がある
            where: { id } ,
            include: { category: true},
        });

        if(!t) {
            return next(
                createError(404, "NOT_FOUND", "transaction not found",{
                    id,
                    response: "The specified transaction does not exist"
                })
            );
        }
        return res.json({
            id: t.id,
            date: t.date.toISOString().slice(0, 10),
            type: t.type as IncExpBase,
            categoryId: t.categoryId,
            categoryName: t.category.name,
            title: t.title,
            amount: t.amount,
        });
    } catch (err) {
        next(err);
    }
});


// POST /transactions

router.post("/", async (req, res, next) =>{
    try {
        const body = req.body as {
            date?: string;
            type?: "income" | "expense";
            categoryId?: string;
            title?: string;
            amount?: number;
        };

    const { date, type, categoryId, title, amount } = body;

    if(
        typeof date !== "string"|| (type !== "income" && type !== "expense") || typeof categoryId !== "string" || typeof title !== "string" || typeof amount !== "number"
    ){
        return res.status(400).json ({
            error:{ code: "INVALID_BODY", message: "Invalid request body" },
        });
    }

    const created = await prisma.transaction.create({
        data: {
            date: new Date(date),
            type,
            categoryId,
            title,
            amount,
        },
        include: {category: true},
    });

    return res.status(201).json({
        id: created.id,
        date: created.date.toISOString().slice(0, 10),
        type: created.type,
        categoryId: created.categoryId,
        categoryName: created.category.name,
        title: created.title,
        amount: created.amount,

    });
    } catch (e) {
        next(e);
    }
}
);


// PUT /transactions/:id（更新）
router.put("/:id", async (req, res, next) => {
    logger.debug(`PUT /transactions/:id called id=${req.params.id} body=${JSON.stringify(req.body)}`);;

  try {
    const id = req.params.id;

    const body = req.body as {
      date?: string;
      type?: "income" | "expense";
      categoryId?: string;
      title?: string;
      amount?: number;
    };

    // 最小：存在するものだけ更新
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(typeof body.date === "string" ? { date: new Date(body.date) } : {}),
        ...(body.type === "income" || body.type === "expense" ? { type: body.type } : {}),
        ...(typeof body.categoryId === "string" ? { categoryId: body.categoryId } : {}),
        ...(typeof body.title === "string" ? { title: body.title } : {}),
        ...(typeof body.amount === "number" ? { amount: body.amount } : {}),
      },
      include: { category: true },
    });

    return res.json({
      id: updated.id,
      date: updated.date.toISOString().slice(0, 10),
      type: updated.type,
      categoryId: updated.categoryId,
      categoryName: updated.category.name,
      title: updated.title,
      amount: updated.amount,
    });
  } catch (e) {
    next(e);
  }
});

// DELETE /transactions/:id（削除）
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.transaction.delete({ where: { id } });
    return res.status(204).end();
  } catch (e) {
    next(e);
  }
});


export default router;