import type { Transaction,Draft } from "@/features/transactions/types/transaction";
import {useMemo,useState,useEffect} from "react";
import TransactionDetailView from "@/features/transactions/ui/Templates/transactionDetailView";

type Props = {
    id: string;
    transactions: Transaction[];
    onUpdate:(updated:Transaction) => void ;
};


const TransactionDetail = ({id,transactions,onUpdate}:Props) => {
    const [isEditing,setIsEditing] = useState(false); //編集中かどうか管理　false:編集中ではない

    const transaction = useMemo(() => {
        return transactions.find(
            (transaction) => transaction.id === id
        );
    },[transactions,id]);

    useEffect(() => {
    setIsEditing(false);
    },[id]);

    
const handleSaveEdit = (draft: Draft) => {
    if (!transaction) return; //元データがなければ何もしない
    onUpdate({...transaction, ...draft}); //後勝ちルール。先にtransaction(元データ)を展開、後からdraft(編集後データ)を展開
    setIsEditing(false); //編集モード終了
};

return(
    <TransactionDetailView
        id={id}
        transaction={transaction}
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onSaveEdit={handleSaveEdit}
    />
);

};

export default TransactionDetail ;