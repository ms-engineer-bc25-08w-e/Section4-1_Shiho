import HomeClient from "./components/HomeClient";
import type { Transaction } from "@/features/transactions/types/transaction";

export default async function Page() {
  let initialTransactions: Transaction[] = [];

  try {
    const res = await fetch("http://localhost:4000/transactions", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      initialTransactions = data.items ?? [];
    }
  } catch {
    // 失敗時は空配列で表示
  }

  return <HomeClient initialTransactions={initialTransactions} />;
}
