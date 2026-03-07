import TransactionDetailClient from "@/features/transactions/TransactionDetailClient";
import type { TransactionsResponse } from "@/features/transactions/types/transaction";
import { apiFetch } from "@/features/transactions/api/apiClient";


// const API_URL="http://localhost:4000" //json-serverのURLを代入

async function getTransactions():Promise<TransactionsResponse>{ //Promiseあとで結果が返ってくる約束。今回はResponse。
  return await apiFetch<TransactionsResponse>("/transactions")
}

// export async function generateStaticParams() { //Next.jsのページコンポーネント(詳細用)generateStaticParamsは動的ルートをビルド時生成するための公式機能
//   const data = await getTransactions();//サーバー上でAPIから取引データを取得
//   return data.items.map((t) => ({id: t.id}));
// }

type PageProps = { //ページコンポーネントに渡されるpropsの型
  params: { id: string } | Promise<{ id: string }>; //{ id: string }:すぐ使えるparams、Promise<{ id: string }>:awaitが必要なparams
};

// 詳細ページのサーバー側の入り口
export default async function Page({params}:PageProps) {
  const { id } = await Promise.resolve(params);  // URLからidを受け取る(paramsがPromiseでも安全に取り出す)
  const transactions = await getTransactions();
  
  // URLで受け取ったidと取得した一覧データを渡す
  return (
    <TransactionDetailClient 
      id={id}
      initialTransactions={transactions.items} 
    />
   );
}




