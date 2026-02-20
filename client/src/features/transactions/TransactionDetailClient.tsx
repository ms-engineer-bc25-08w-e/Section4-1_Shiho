"use client";

import {useState} from "react";
import type { Transaction } from "@/features/transactions/types/transaction";
import  TransactionDetail  from "@/app/components/incomeAndExpenditureDetail";

type props ={
    id: string;
    initialTransactions: Transaction[];
};

export default function TransactionDetailClient({id,initialTransactions}:props){ //詳細表示 / 編集・更新
    const [transactions,setTransactions] = useState<Transaction[]>(initialTransactions); //transactions:今の状態(state),setTransactions:状態を更新するための関数,initialTransactions:stateの初期値

    const handleUpdate = (update:Transaction) => {
        setTransactions((prev) => 
        prev.map((t) => (t.id === update.id ? update : t))//idが一致するものだけ差し替え 三項演算子 条件 ? 真のときの値 : 偽のときの値 
        );     
    };
    return (<TransactionDetail id={id} transactions={transactions} onUpdate={handleUpdate} />);

};


