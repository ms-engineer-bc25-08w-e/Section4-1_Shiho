import type { Transaction, Draft } from "@/features/transactions/types/transaction";
import { useMemo, useState } from "react";
import TransactionDetailView from "@/features/transactions/ui/Templates/transactionDetailView";
import { updateTransaction } from "@/features/transactions/api/apiClient";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  transactions: Transaction[];
  onUpdate: (updated: Transaction) => void;
};

const TransactionDetail = ({ id, transactions, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false); //編集中かどうか管理　false:編集中ではない

  const transaction = useMemo(() => {
    return transactions.find((transaction) => transaction.id === id);
  }, [transactions, id]);

  const router = useRouter();

  const onCancelEdit = () => {
    router.push("/"); // 初期表示画面へ遷移
  };

  const handleSaveEdit = async (draft: Draft) => {
    if (!transaction) return; //元データがなければ何もしない

    const updated = await updateTransaction(id, draft);
    onUpdate(updated); // サーバ結果で更新

    router.push("/");
  };

  return (
    <TransactionDetailView
      id={id}
      transaction={transaction}
      isEditing={isEditing}
      onStartEdit={() => setIsEditing(true)}
      onCancelEdit={onCancelEdit}
      onSaveEdit={handleSaveEdit}
    />
  );
};

export default TransactionDetail;
