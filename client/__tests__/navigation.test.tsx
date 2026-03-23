import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "@/features/transactions/home";
import { Transaction } from "@/features/transactions/types/transaction";

// Next.js の Link コンポーネントをテスト用に擬似化（モック）する設定
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("画面遷移のテスト", () => {
  it("ダッシュボードから一覧ページ（/transaction）へのリンクが存在すること", () => {
    // ダッシュボードを表示するため isListPage={false} にする
    render(<Home transactions={[]} onAdded={() => {}} onDelete={() => {}} isListPage={false} />);

    const allLinks = screen.getAllByRole("link");
    // URLに "transaction" が含まれるリンクを探す
    const listLink = allLinks.find((link) => link.getAttribute("href") === "/transaction");

    expect(listLink).toBeDefined();
  });

  it("一覧ページ内で個別明細（/transaction/ID）へのリンクが存在すること", () => {
    const targetId = "aaa";
    const detailTransactions: Transaction[] = [
      {
        id: targetId,
        amount: 1000,
        categoryName: "食費",
        categoryId: "c_food",
        title: "買い物",
        type: "expense",
        date: "2026-03-20",
      },
    ];

    // リストを表示するため isListPage={true} にする
    render(<Home transactions={detailTransactions} onAdded={() => {}} onDelete={() => {}} isListPage={true} />);

    const allLinks = screen.getAllByRole("link");
    const hasDetailLink = allLinks.some((link) => link.getAttribute("href")?.includes(`/transaction/${targetId}`));

    expect(hasDetailLink).toBe(true);
  });
});
