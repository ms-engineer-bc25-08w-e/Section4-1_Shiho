import { CategoryChartTemplate } from "@/features/transactions/ui/Templates/CategoryChartTemplate";

// インターフェースの定義
interface Transaction {
  amount: number;
  categoryName: string;
  type: "income" | "expense";
}
//
const formatData = (transactions: Transaction[], targetType: string[]) => {
  // Record<Keys, Type>型引数
  const summary: Record<string, number> = {};

  // forEach()与えられた関数を配列の各要素に対して一度ずつ実行
  transactions.forEach((t) => {
    // 判定：入力が"支出"でも"expense"でも拾えるように配列でチェック
    if (targetType.includes(t.type)) {
      const name = t.categoryName || "その他";
      // 連想配列、カテゴリ毎の合計計算
      summary[name] = (summary[name] || 0) + t.amount;
    }
  });

  return (
    // イメージ：変換前{ "食費": 5000, "光熱費": 12000 }→変換後：[ ["食費", 5000], ["光熱費", 12000] ]
    Object.entries(summary)

      // イメージ：変換前["食費", 5000]→変換後{ name: "食費", value: 5000 }
      .map(([name, value]) => ({ name, value }))

      // 昇順
      .sort((a, b) => b.value - a.value)
  );
};

export const CategoryChart = ({ transactions }: { transactions: Transaction[] }) => {
  // デバッグ用：データが来ているかコンソールで確認
  // console.log("全データ:", transactions);

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
