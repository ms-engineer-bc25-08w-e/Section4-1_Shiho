import TransactionForm from "@/app/components/inputForm";
import { Transaction, Draft } from "@/features/transactions/types/transaction";
import Link from "next/link";

type Props = {
  id: string; //表示対象のID
  transaction?: Transaction; //実際の取引データ本体
  isEditing: boolean; //編集モードかどうか true:編集中 false:表示のみ（将来用に残す）
  onStartEdit: () => void; //編集ボタン（将来用に残す）
  onCancelEdit: () => void; //キャンセルボタン
  onSaveEdit: (draft: Draft) => void; //編集したの内容を保存
};

export default function TransactionDetailView({
  id,
  transaction,
  //isEditing,
  //onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: Props) {
  if (!transaction) {
    return (
      //mx-auto:左右余白auto max-w-4xl:横幅制限 p-6:padding grid:デフォルト動作で縦並び gap-6:Card間間隔
      <div className="mx-auto max-w-4xl p-6 grid gap-6">
        <h2>編集</h2>
        <p className="border-b border-slate-100 px-3 py-2 text-right tabular-nums">データが見つかりません（id:{id}）</p>
        <Link href="/" className="underline underline-offset-4 hover:text-pink-300">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 grid gap-4">
      <h2 className="text-lg font-semibold">編集</h2>

      <TransactionForm mode="edit" detailDraft={transaction} onSave={onSaveEdit} />

      <button
        className="mt-2 rounded-md bg-blue-500 px-1 py-2 text-sm font-semibold text-white hover:bg-blue-300"
        onClick={onCancelEdit}
        type="button"
      >
        キャンセル
      </button>
    </div>
  );
}
