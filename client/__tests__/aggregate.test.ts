import { describe, it, expect } from "vitest";
import { aggregateMonthly } from "../src/app/components/incomeAndExpenditureMonthly";
import { Transaction } from "@/features/transactions/types/transaction";

// toBe:完全一致を確認,toEqual:見た目や構造が同じであることを確認,toBeNull:nullであることを確認,toHaveLength:長さ・個数が想定通りであることを確認
// describe: テストのグループ化

describe("aggregateMonthly のテスト", () => {
  //it (または test): 個別のテストケース
  // 【正常系】正しく合算されるか
  it("同じ月のデータが正しく集計されること", () => {
    const mockData: Transaction[] = [
      {
        id: "1",
        date: "2025-01-10",
        type: "income",
        amount: 1000,
        categoryId: "c1",
        categoryName: "給与",
        title: "給料",
      },
      {
        id: "2",
        date: "2025-01-15",
        type: "expense",
        amount: 300,
        categoryId: "c2",
        categoryName: "食費",
        title: "ランチ",
      },
    ];

    const result = aggregateMonthly(mockData);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      month: "2025-01",
      income: 1000,
      expense: 300,
      result: 700,
    });
  });

  // 【異常系】データが空の場合
  it("空の配列を渡したとき、空の配列が返ってくること", () => {
    const result = aggregateMonthly([]);
    expect(result).toEqual([]);
  });

  // 【異常系】金額が0やマイナスの場合
  it("金額にマイナスが含まれていても、そのまま計算されること", () => {
    const mockData: Transaction[] = [
      {
        id: "3",
        date: "2025-02-01",
        type: "income",
        amount: -100,
        categoryId: "c1",
        categoryName: "テスト",
        title: "マイナス",
      },
    ];
    const result = aggregateMonthly(mockData);
    expect(result[0].income).toBe(-100);
  });
});
