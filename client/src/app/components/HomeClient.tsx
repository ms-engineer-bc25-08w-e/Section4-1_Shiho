"use client";

import Home from "@/features/transactions/home";
import { useState, useEffect, use } from "react";
import type { Transaction,Draft, TransactionsResponse } from "@/features/transactions/types/transaction";
import { apiFetch } from "@/features/transactions/api/apiClient";
import { ErrorBanner } from "@/features/transactions/ui/molecules/ErrorBanner"; 

type Props = {
    initialTransactions: Transaction[]; //初期トランザクション
};

export default function HomeClient({initialTransactions}: Props){ //Props型に定義された中のinitialTransactionsを取り出す（分割代入）,一覧表示 / 新規追加
    const [transactions,setTransactions] = useState<Transaction[]>(initialTransactions);

    const [error, setError] = useState<unknown>(null); //エラー用

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const data = await apiFetch<TransactionsResponse>("/transactions");
                setTransactions(data.items);
                // 確認用：わざと400を起こす
                // await apiFetch("/transactions?month=2025-13");
                
            } catch (e) {
                setError(e);
            };
        })();
    }, []);

    // ★チェック用
    useEffect(() => {
        console.log("transactions length:", transactions.length);
    }, [transactions]);

    const handleAdded = (created: Transaction) => {
        setTransactions((prev) => [created, ...prev]);
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm("削除しますか？");
        if(!ok) return;

        try {
            setError(null);
            await apiFetch<void>(`/transactions/${id}`,{ method: "DELETE"});
            setTransactions((prev) => prev.filter((t) => t.id !== id));
        } catch (e) {
            setError(e);
        }

    }

return (
    <>
        <div className="p-4">
            <ErrorBanner error={error} />
        </div>

        {/* Homeコンポーネントを表示し入出金データ(transactions)、追加処理の関数(handleAdd)をpropsとして渡す */}
        <Home 
            transactions={transactions} 
            onAdded={handleAdded}
            onDelete={handleDelete}
        />
        
    </>
);
};