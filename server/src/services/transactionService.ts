//DB（Prisma）へのアクセスと、データの加工を担当

import { prisma } from "../prisma";
import { Prisma } from "../generated/prisma";
import { IncExpBase } from "../incExp";

export const transactionService = {
  async findAll(query: { month?: string; type?: undefined | "income" | "expense"; categoryId?: string }) {
    const { month, type, categoryId } = query;
    // Express + TypeScript では req.queryの型は最初から以下の通り定義されている
    // string | string[] | ParsedQs | ParsedQs[] | undefined
    const where: Prisma.TransactionWhereInput = {}; // where句の型指定

    if (typeof type === "string") where.type = type;

    if (typeof categoryId === "string") where.categoryId = categoryId;

    if (typeof month === "string") {
      const start = new Date(`${month}-01T00:00:00.000Z`); // その月の1日 00:00:00
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1); // getMonth():今月を取得、setMonth(n):月をnに変更

      // date列に対する条件セット
      // Prismaのフィルター構文、gte:>=、lt:<
      where.date = { gte: start, lt: end };
    }

    const rows = await prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }],
      include: { category: true },
    });

    return rows.map((t) => ({
      id: t.id,
      date: t.date.toISOString().slice(0, 10), // .toISOString():Date→ISO形式の文字列に変換する
      type: t.type as IncExpBase, // 独自の型の為型を明示的に指定
      categoryId: t.categoryId,
      categoryName: t.category.name,
      title: t.title,
      amount: t.amount,
    }));
  },

  // 1件取得
  async findById(id: string) {
    const t = await prisma.transaction.findUnique({
      // PrimaryKeyやUniqueのカラムをWHERE句に指定してデータを取得する場合はfindUniqueを使用する必要がある
      where: { id },
      include: { category: true },
    });
    if (!t) return null;

    return {
      id: t.id,
      date: t.date.toISOString().slice(0, 10),
      type: t.type as IncExpBase,
      categoryId: t.categoryId,
      categoryName: t.category.name,
      title: t.title,
      amount: t.amount,
    };
  },

  // 新規作成
  async create(data: { date: string; type: "income" | "expense"; categoryId: string; title: string; amount: number }) {
    const { date, type, categoryId, title, amount } = data;

    const created = await prisma.transaction.create({
      data: {
        date: new Date(`${date}T00:00:00Z`), // 日付を文字列で確実に渡す
        type: type,
        categoryId: categoryId,
        title: title || " ", // nullを許容する
        amount: amount,
      },
      include: { category: true },
    });

    return {
      id: created.id,
      date: created.date.toISOString().slice(0, 10),
      type: created.type as IncExpBase,
      categoryId: created.categoryId,
      categoryName: created.category.name,
      title: created.title ?? "",
      amount: created.amount,
    };
  },

  // 更新
  async update(id: string, body: any) {
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

    return {
      id: updated.id,
      date: updated.date.toISOString().slice(0, 10),
      type: updated.type,
      categoryId: updated.categoryId,
      categoryName: updated.category.name,
      title: updated.title,
      amount: updated.amount,
    };
  },

  // DELETE /transactions/:id（削除）
  async delete(id: string) {
    await prisma.transaction.delete({ where: { id } });
  },
};
