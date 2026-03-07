import type {Transaction} from "@/features/transactions/types/transaction";
import MonthlySummary from "./incomeAndExpenditureMonthly";
import TransactionTable from "@/features/transactions/ui/Templates/transactionList";
import { ErrorBanner } from "@/features/transactions/ui/molecules/ErrorBanner";

type Props = {
    transactions: Transaction[] ; //「このコンポーネントは入出金データの一覧を受け取ります」という契約書(型定義)
    getDetailHref:(id:string) => string; //transactionsのid(id:string)を引数として受け取りリンク用のURLを文字列型(string)で返す関数
    error?: unknown;
    onDelete: (id:string) => void;
} ;

const TransactionList = ({transactions, getDetailHref, error, onDelete}:Props) => { //transactionsの中身を変数として取り出す(関数の引数)
    return (
        //grid gap-4:gridデフォルト動作で中身は縦並びgapで間隔を揃える
        <div className="grid gap-4">
            {/* text-lg::文字少し大きい　font-semibold:文字少し太い */}
            <h2 className="text-lg font-semibold">入金一覧</h2>

                <ErrorBanner error={error} />

                <TransactionTable
                    transactions={transactions} 
                    getDetailHref={getDetailHref} 
                    onDelete={onDelete}
                />
        </div>
    )
};

export default TransactionList ;