import TransactionForm from "@/app/components/inputForm";
import TransactionList from "@/app/components/incomeAndExpenditureList";
import type { Transaction } from "./types/transaction";
import Card from "./ui/molecules/card";
import MonthlySummary from "@/app/components/incomeAndExpenditureMonthly"

type Props ={
    transactions:Transaction[];
    onAdded:(created:Transaction) => void;
    onDelete: (id: string) => void;
};

const Home = ({transactions, onAdded, onDelete}:Props) =>{ //Homeコンポーネント　props型で決めた2つの値を受け取る
    return(
        //mx-auto:左右余白auto max-w-4xl:横幅制限 p-6:padding grid:デフォルト動作で縦並び gap-6:Card間間隔
        <div className="mx-auto max-w-5xl p-6">
            {/* text-2x1:文字サイズ font-bold:太字 */}
            <h1 className="mb-6 text-2xl font-bold text-white">家計簿</h1>
            <div className="grid gap-6 md:grid-cols-[1fr_2fr] items-start whitespace-nowrap">
                <Card>
                    <TransactionForm onAdded={onAdded}/> {/*入力フォーム */}
                </Card>
                <Card>
                    <TransactionList 
                        transactions={transactions} 
                        getDetailHref={(id) => `/transaction/${id}`}//「/transaction/${id}」でリンク先のURLを作成
                        onDelete={onDelete}
                    /> {/*一覧表示 */}
                    
                </Card>
                <div className="md:col-span-2">
                    <Card>
                        <MonthlySummary transactions={transactions} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home; //このファイルからデフォルトとしてHomeを外に出す