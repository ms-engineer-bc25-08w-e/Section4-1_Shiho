import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

// toBe:完全一致を確認,toEqual:見た目や構造が同じであることを確認,toBeNull:nullであることを確認,toHaveLength:長さ・個数が想定通りであることを確認,toContain:部分一致を確認
// describe: テストのグループ化

describe("POST /transactions APIの品質テスト", () => {
  // 【正常系】正しいデータが保存できるか
  it("正しい形式のデータであれば、ステータス201と登録データを返すこと", async () => {
    const validData = {
      date: "2025-12-01",
      type: "expense",
      categoryId: "c_travel",
      title: "おやつ代",
      amount: 500,
    };

    const app = createApp(); // ここで実体を作る
    const response = await request(app).post("/transactions").send(validData); // ここにappを入れる

    // ステータスコードが201(Created)か200(OK)であることを確認
    expect([200, 201]).toContain(response.status);
    expect(response.body.amount).toBe(500);
    expect(response.body.title).toBe("おやつ代");
  });

  // 【正常系】title（メモ）が空の場合
  it("メモ(title)が空文字であっても、正常に登録(201)ができること", async () => {
    const emptyTitleData = {
      date: "2026-03-25",
      type: "income",
      categoryId: "c_salary",
      title: "", // 空文字をテスト
      amount: 1000,
    };

    const app = createApp();
    const response = await request(app).post("/transactions").send(emptyTitleData);

    expect(response.status).toBe(201);
  });

  // 【異常系】金額が不正な場合
  it("金額(amount)が負の数の場合、400エラーを返すこと", async () => {
    const invalidData = {
      date: "2025-12-01",
      type: "expense",
      categoryId: "c_travel",
      title: "エラーテスト",
      amount: -100, // 不正な金額
    };

    const app = createApp();
    const response = await request(app).post("/transactions").send(invalidData);

    expect(response.status).toBe(400);
  });

  // 【異常系】必須項目の欠落
  it("カテゴリID(categoryId)が未指定の場合、400エラーを返すこと", async () => {
    const noCategoryData = {
      date: "2026-03-25",
      type: "expense",
      // categoryIdなし
      title: "お弁当",
      amount: 800,
    };

    const app = createApp();
    const response = await request(app).post("/transactions").send(noCategoryData);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_BODY");
  });

  // 【異常系】数値変換の失敗
  it("金額(amount)に数値化できない文字列が渡された場合、400エラーを返すこと", async () => {
    const invalidAmountData = {
      date: "2026-03-25",
      type: "expense",
      categoryId: "c_food",
      title: "テスト",
      amount: "abc", // 文字列を送信
    };

    const app = createApp();
    const response = await request(app).post("/transactions").send(invalidAmountData);

    expect(response.status).toBe(400);
    // Controllerの必須チェックを通っていることを確認
    expect(response.body.error.detail.response).toContain("amount");
  });
});
