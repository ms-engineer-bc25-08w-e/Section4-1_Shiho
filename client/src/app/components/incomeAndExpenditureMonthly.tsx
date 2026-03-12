import type { Transaction } from "@/features/transactions/types/transaction";
import { useMemo } from "react";
import MonthlySummaryTable from "@/features/transactions/ui/Templates/monthlySummaryList";

export const aggregateMonthly = (transactions: Transaction[]) => {
  const map = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    // 異常系への備え：date が無い場合
    if (!t.date) continue;

    const month = t.date.slice(0, 7);
    const current = map.get(month) ?? { income: 0, expense: 0 }; // 月のデータがまだMapになければ{0, 0} からスタートする

    // incomeなら収入、それ以外（支出）なら支出に金額をプラス
    if (t.type === "income") current.income += t.amount;
    else current.expense += t.amount;

    map.set(month, current); // イメージ 2025-01：{収入100, 支出50}
  }

  // map.entries():mapの中身（月と金額のペア）を全て取り出す、Array.from():普通の配列の形にする
  return Array.from(map.entries()).map(([month, value]) => ({
    month,
    income: value.income,
    expense: value.expense,
    result: value.income - value.expense,
  }));
};

type Props = {
  transactions: Transaction[];
};

const MonthlySummary = ({ transactions }: Props) => {
  // useMemo(() => 関数, [依存するもの])、[transactions]が変わったらaggregateMonthly(値)を再計算する
  const rows = useMemo(() => aggregateMonthly(transactions), [transactions]);

  return (
    <div className="grid gap-4">
      <MonthlySummaryTable rows={rows} />
    </div>
  );
};

export default MonthlySummary;
