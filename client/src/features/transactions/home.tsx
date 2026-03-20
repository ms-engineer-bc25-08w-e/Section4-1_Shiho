import TransactionForm from "@/app/components/inputForm";
import TransactionList from "@/app/components/incomeAndExpenditureList";
import type { Transaction } from "./types/transaction";
import Card from "./ui/molecules/card";
import MonthlySummary from "@/app/components/incomeAndExpenditureMonthly";
import { CategoryChart } from "@/app/components/CategoryChart";
import Link from "next/link";

type Props = {
  transactions: Transaction[];
  onAdded: (created: Transaction) => void;
  onDelete: (id: string) => void;
  isListPage?: boolean;
};

const Home = ({ transactions, onAdded, onDelete, isListPage = false }: Props) => {
  if (isListPage) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">取引明細一覧</h1>
          <Link
            href="/"
            className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-slate-600 transition-colors"
          >
            ← ダッシュボードへ
          </Link>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <TransactionList
              transactions={transactions}
              getDetailHref={(id) => `/transaction/${id}`}
              onDelete={onDelete}
            />
          </div>
        </Card>
      </div>
    );
  }

  //Homeコンポーネント
  return (
    //mx-auto:左右余白auto max-w-4xl:横幅制限 p-6:padding grid:デフォルト動作で縦並び gap-6:Card間間隔
    <div className="mx-auto max-w-6xl p-6">
      {/* text-2x1:文字サイズ font-bold:太字 */}
      <h1 className="mb-6 text-2xl font-bold text-white">家計簿</h1>
      <div className="grid gap-6 md:grid-cols-3 items-start whitespace-nowrap">
        <Card>
          <TransactionForm onAdded={onAdded} /> {/*入力フォーム */}
        </Card>
        <div className="md:col-span-2">
          <CategoryChart transactions={transactions} />
        </div>
        {/*
        <Card>
          <TransactionList
            transactions={transactions}
            getDetailHref={(id) => `/transaction/${id}`} //「/transaction/${id}」でリンク先のURLを作成
            onDelete={onDelete}
          />{" "}
          {/*一覧表示 
        </Card>
        */}
        <div className="md:col-span-3">
          <Card>
            <MonthlySummary transactions={transactions} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; //このファイルからデフォルトとしてHomeを外に出す
