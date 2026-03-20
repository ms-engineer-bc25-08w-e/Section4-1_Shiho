// seed:APIとは別のDB準備専用プログラム(SQLを生成→DBへ送信→結果を受け取る)

import { PrismaClient, CategoryType } from "../src/generated/prisma";

const prisma = new PrismaClient(); // 実体

// 非同期処理をまとめるメイン関数(Promiseを返す)
async function main() {
  const categories = await prisma.category.createMany({
    data: [
      { id: "c_food", name: "食費", type: CategoryType.expense },
      { id: "c_travel", name: "交通費", type: CategoryType.expense },
      { id: "c_salary", name: "給与", type: CategoryType.expense },
      { id: "c_sideinc", name: "副収入", type: CategoryType.expense },
      { id: "c_other", name: "その他", type: CategoryType.expense },
    ],
    skipDuplicates: true,
  });

  // 1件だけ取引を入れて動作確認（カテゴリIDが必要なので取得）
  const food = await prisma.category.findFirst({ where: { name: "食費" } });

  if (food) {
    await prisma.transaction.create({
      data: {
        date: new Date("2026-02-01"),
        type: "expense",
        title: "",
        amount: 900,
        categoryId: food.id,
      },
    });
  }

  console.log("seed done", { categories }); // 終了ログ
}

// Promiseが失敗したときの保険
main()
  .catch((e) => {
    // エラーをキャッチしてエラーを表示する
    console.error(e);
    process.exit(1); // 正常終了:0、異常終了:1
  })
  .finally(async () => {
    await prisma.$disconnect(); // 成功でも失敗でもDB接続を閉じる
  });
