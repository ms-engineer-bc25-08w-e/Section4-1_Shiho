import { CategoryChartTemplate } from "@/features/transactions/ui/Templates/CategoryChartTemplate";

// インターフェースの定義
interface Transaction {
  amount: number;
  categoryName: string;
  type: "income" | "expense";
}

const formatData = (transactions: Transaction[], targetType: string[]) => {
  const summary: Record<string, number> = {};

  transactions.forEach((t) => {
    // 判定：入力が "支出" でも "expense" でも拾えるように配列でチェック
    if (targetType.includes(t.type)) {
      const name = t.categoryName || "その他";
      summary[name] = (summary[name] || 0) + t.amount;
    }
  });

  return Object.entries(summary)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const CategoryChart = ({ transactions }: { transactions: Transaction[] }) => {
  // デバッグ用：データが来ているかコンソールで確認
  console.log("全データ:", transactions);

  // 収入と支出を集計（念のため日本語・英語両方の可能性を考慮）
  const incomeChartData = formatData(transactions, ["収入", "income"]);
  const expenseChartData = formatData(transactions, ["支出", "expense"]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* 収入：データがある時だけ表示 */}
      <div className="flex-1">
        <CategoryChartTemplate data={incomeChartData} title="収入の内訳" />
      </div>

      {/* 支出：データがある時だけ表示 */}
      <div className="flex-1">
        <CategoryChartTemplate data={expenseChartData} title="支出の内訳" />
      </div>
    </div>
  );
};

// // データを集計する関数
// const formatDataForChart = (transactions: Transaction[]) => {
//   const summary: Record<string, number> = {};

//   transactions.forEach((t) => {
//     // 支出(expense)だけを集計する場合
//     if (t.type === "expense") {
//       const name = t.categoryName || "その他";
//       summary[name] = (summary[name] || 0) + t.amount;
//     }
//   });

//   return Object.entries(summary).map(([name, value]) => ({
//     name,
//     value,
//   }));
// };

// export const CategoryChart = ({ transactions }: { transactions: Transaction[] }) => {
//   // 1. ロジック：データをグラフ用に加工
//   const chartData = formatDataForChart(transactions);

//   // 2. 表示：Templateにデータを渡して丸投げ
//   return <CategoryChartTemplate data={chartData} />;
// };
