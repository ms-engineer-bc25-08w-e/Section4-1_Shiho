//client\src\app\transaction\page.tsx

import type { Transaction } from "@/features/transactions/types/transaction";
import HomeClient from "../components/HomeClient";

export default async function TransactionListPage() {
  let initialTransactions: Transaction[] = [];

  try {
    // データ取得は今まで通りサーバー側で行う
    const res = await fetch("http://localhost:4000/transactions", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      initialTransactions = data.items ?? [];
    }
  } catch {}

  // HomeClient を「一覧モード」で呼び出す
  return <HomeClient initialTransactions={initialTransactions} isListPage={true} />;
}
