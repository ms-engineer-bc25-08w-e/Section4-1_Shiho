import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

// toBe:完全一致を確認,toEqual:見た目や構造が同じであることを確認,toBeNull:nullであることを確認,toHaveLength:長さ・個数が想定通りであることを確認
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
    const response = await request(app).post("/transactions").send(validData); // ここに app を入れる

    // ステータスコードが 201 (Created) か 200 (OK) であることを確認
    expect([200, 201]).toContain(response.status);
    expect(response.body.amount).toBe(500);
    expect(response.body.title).toBe("おやつ代");
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

    // ここで400が返るようにサーバー側を実装する
    expect(response.status).toBe(400);
  });
});
