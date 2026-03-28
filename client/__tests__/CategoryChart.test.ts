import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CategoryChart } from "@/app/components/CategoryChart";
import { CategoryChartTemplate } from "@/features/transactions/ui/Templates/CategoryChartTemplate";
import type { Transaction } from "@/features/transactions/types/transaction";
import React from "react";

// グラフ用データの型定義
interface ChartData {
  name: string;
  value: number;
}

// モックの設定
vi.mock("@/features/transactions/ui/Templates/CategoryChartTemplate", () => ({
  CategoryChartTemplate: vi.fn(({ data: _data }: { data: ChartData[] }) =>
    // 空の<div>を生成してrenderした際に、本物のグラフライブラリが動いてエラーになるのを防ぐ
    React.createElement("div", { "data-testid": "mock-chart" }),
  ),
}));

describe("CategoryChart の集計テスト", () => {
  it("支出データのみを合計し、正確なグラフ用データを生成すること", () => {
    // テストデータの準備
    const mockTransactions: Transaction[] = [
      {
        id: "cml1",
        date: "2026-03-25",
        type: "expense",
        categoryId: "c_food",
        categoryName: "食費",
        title: "ランチ",
        amount: 1200,
      },
      {
        id: "cml2",
        date: "2026-03-25",
        type: "income",
        categoryId: "c_salary",
        categoryName: "給与",
        title: "",
        amount: 5000,
      },
      {
        id: "cml3",
        date: "2026-03-25",
        type: "expense",
        categoryId: "c_food",
        categoryName: "食費",
        title: "おやつ",
        amount: 300,
      },
      {
        id: "cml4",
        date: "2026-03-25",
        type: "expense",
        categoryId: "c_other",
        categoryName: "その他",
        title: "洗剤",
        amount: 800,
      },
    ];

    // toBe:完全一致を確認,toBeUndefined:undefinedをになることを確認

    // 描画
    render(React.createElement(CategoryChart, { transactions: mockTransactions }));

    // 検証（型を明示してデータを取り出す）
    const mockedTemplate = vi.mocked(CategoryChartTemplate);

    // 1つ目の []: 何回目の呼び出し（コール）か、2つ目の []: その時の何番目の引数か。
    const expenseDataE = mockedTemplate.mock.calls[1][0].data as ChartData[];

    // デバッグログも支出の方を見るように修正
    // console.log("計算された支出データ:", JSON.stringify(expenseData, null, 2));

    // 支出データの中から「食費」を検証
    const food = expenseDataE.find((d) => d.name === "食費");
    expect(food?.value).toBe(1500);

    // 支出データの中から「その他」を検証
    const daily = expenseDataE.find((d) => d.name === "その他");
    expect(daily?.value).toBe(800);

    // 「収入」が混ざっていないか支出データ側で確認
    const incomeInExpenseE = expenseDataE.find((d) => d.name === "給与");
    expect(incomeInExpenseE).toBeUndefined();

    // 1つ目の []: 何回目の呼び出し（コール）か、2つ目の []: その時の何番目の引数か。
    const expenseDataI = mockedTemplate.mock.calls[0][0].data as ChartData[];

    // 「支出」が混ざっていないか収入データ側で確認
    const incomeInExpenseI = expenseDataI.find((d) => d.name === "食費");
    expect(incomeInExpenseI).toBeUndefined();
  });
});
