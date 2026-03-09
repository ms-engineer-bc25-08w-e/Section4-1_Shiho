import { describe, it, expect } from "vitest";
import { validateTransaction } from "../src/app/components/inputForm";
import { Draft } from "@/features/transactions/types/transaction";

// toBe:完全一致を確認,toEqual:見た目や構造が同じであることを確認,toBeNull:nullであることを確認,toHaveLength:長さ・個数が想定通りであることを確認
// describe: テストのグループ化

describe("validateTransaction (バリデーション関数のテスト)", () => {
  // 【正常系】
  it("必要なデータが全て揃っている場合はnullを返す", () => {
    const validDraft: Draft = {
      date: "2025-01-01",
      type: "expense",
      categoryId: "cat1",
      categoryName: "食費",
      title: "ランチ",
      amount: 1000,
    };
    expect(validateTransaction(validDraft)).toBeNull();
  });

  // 【異常系】カテゴリ未選択
  it("カテゴリIDが空の場合、エラーメッセージを返す", () => {
    const invalidDraft: Draft = {
      date: "2025-01-01",
      type: "expense",
      categoryId: "", // 空にする
      categoryName: "",
      title: "ランチ",
      amount: 1000,
    };
    expect(validateTransaction(invalidDraft)).toBe("カテゴリを選択してください");
  });

  // 【異常系】金額が0以下
  it("金額が0の場合、エラーメッセージを返す", () => {
    const invalidDraft: Draft = {
      date: "2025-01-01",
      type: "expense",
      categoryId: "cat1",
      categoryName: "食費",
      title: "ランチ",
      amount: 0, // 0円にする
    };
    expect(validateTransaction(invalidDraft)).toBe("金額は1円以上にしてください");
  });
});
