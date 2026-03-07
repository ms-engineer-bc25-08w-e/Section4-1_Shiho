export type TransactionType = "income" | "expense" ;

export type Transaction = {
  id: string;
  date: string;          // "2025-12-24" 形式を想定
  type: TransactionType; // income（収入） / expense（支出）
  categoryId: string
  categoryName: string;      // 食費 / 給与 等を想定
  title: string;         // メモ（任意の説明を想定）
  amount: number;        // 金額
};

export type Draft = Omit<Transaction,"id">; //既に存在するTransactionからidを除いた新型を構築する

export type TransactionsResponse = {
  items: Transaction[];
  count: number;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense" | "both";
};
