//Serviceの呼び出し、リクエストの検証とエラー生成を担当

import { Request, Response, NextFunction } from "express";
import { transactionService } from "../services/transactionService";
import { AppErr } from "../types/appError";

// エラーの本体（オブジェクト）を作成
function createError(status: number, code: string, message: string, details?: unknown): AppErr {
  const err = new Error(message) as AppErr;
  err.status = status;
  err.code = code;
  err.details = details;
  return err;
}

export const transactionController = {
  //型チェック
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month, type, categoryId } = req.query;
      // Express + TypeScript では req.queryの型は最初から以下の通り定義されている
      // string | string[] | ParsedQs | ParsedQs[] | undefined

      // typeチェック
      if (type !== undefined && type !== "income" && type !== "expense") {
        return next(
          createError(400, "INVALID_QUERY", "Invalid parameter", {
            type,
            response: "type out of range",
          }),
        );
      }

      // monthチェック
      // typeof:値の型を返す（型チェックしないと正規表現でエラーになる）
      // 正規表現:^→先頭、\d{4}→数字4桁（年）、-→ハイフン、\d{2}→数字2桁（月）、$→末尾
      // 正規表現.test(文字列):正規表現のメソッド、monthがYYYY-01~12形式かをチェック
      if (month !== undefined && (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month))) {
        return next(
          createError(400, "INVALID_QUERY", "Invalid parameter", {
            month,
            response: "month out of range",
          }),
        );
      }

      // Serviceから返ってきた値を受け取りレスポンスする準備
      const items = await transactionService.findAll({
        month: month as string,
        type: type as undefined | "income" | "expense",
        categoryId: categoryId as string,
      });
      res.json({ items, count: items.length });
    } catch (err) {
      next(err);
    }
  },

  // ID存在チェック
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string; // 安全な文字列として取り出す

      const item = await transactionService.findById(id);

      if (!item) {
        return next(
          createError(404, "NOT_FOUND", "transaction not found", {
            id,
            response: "The specified transaction does not exist",
          }),
        );
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  // 必須チェック
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const amount = Number(req.body.amount);
      const { date, type, categoryId, title } = req.body;
      if (!date || !type || !categoryId || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          error: {
            code: "INVALID_BODY",
            message: "Invalid request body",
            detail: { response: "amount must be a positive number" },
          },
        });
      }

      const created = await transactionService.create({
        ...req.body,
        amount: amount,
        // もしtitleが空文字 "" なら、" " (半角スペース) または "なし" に置き換える
        title: title === "" ? " " : title,
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  // 更新対象のID存在チェック
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // 存在確認
      const exists = await transactionService.findById(id);
      if (!exists) {
        return next(
          createError(404, "NOT_FOUND", "transaction not found", {
            id,
            response: "The transaction you are trying to update does not exist",
          }),
        );
      }

      // 存在する場合のみ更新実行
      const updated = await transactionService.update(id, req.body);
      res.json(updated); // 自動的に200で扱われる
    } catch (err) {
      next(err);
    }
  },

  // 削除対象のID存在チェック
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // 存在チェック
      const item = await transactionService.findById(id);
      if (!item) {
        return next(
          createError(404, "NOT_FOUND", "transaction not found", {
            id,
            response: "The transaction you are trying to delete does not exist",
          }),
        );
      }

      // 存在する場合のみ削除を実行
      await transactionService.delete(id);

      // 削除成功時は204 No Content を返す
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
