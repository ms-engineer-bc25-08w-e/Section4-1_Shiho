import TransactionForm from "@/app/components/inputForm";
import TransactionList from "@/app/components/incomeAndExpenditureList";
import type { Transaction,Draft } from "./types/transaction";
import Card from "./ui/molecules/card";

type Props ={
    transactions:Transaction[];
    onAdded:(created:Transaction) => void;
};

const Home = ({transactions, onAdded}:Props) =>{ //Homeコンポーネント　props型で決めた2つの値を受け取る
    return(
        //mx-auto:左右余白auto max-w-4xl:横幅制限 p-6:padding grid:デフォルト動作で縦並び gap-6:Card間間隔
        <div className="mx-auto max-w-4xl p-6 grid gap-6">
            <Card>
                <TransactionForm onAdded={onAdded}/> {/*入力フォーム */}
            </Card>
            <Card>
                <TransactionList 
                    transactions={transactions} 
                    getDetailHref={(id) => `/transaction/${id}`}//「/transaction/${id}」でリンク先のURLを作成
                /> {/*一覧表示 */}
            </Card>
        </div>
    );
};

export default Home; //このファイルからデフォルトとしてHomeを外に出す