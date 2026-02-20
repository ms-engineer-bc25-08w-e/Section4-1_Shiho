import TransactionForm from "@/app/components/inputForm";
import { Transaction,Draft } from "@/features/transactions/types/transaction"

type Props = {
    id: string; //表示対象のID
    transaction?: Transaction; //実際の取引データ本体
    isEditing: boolean; //編集モードかどうか true:編集中 false:表示のみ
    onStartEdit: () => void; //編集ボタン
    onCancelEdit: () => void; //キャンセルボタン
    onSaveEdit: (draft: Draft) => void;  //編集したの内容を保存
};

export default function TransactionDetailView({
    id,
    transaction,
    isEditing,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
}:Props){
    if (!transaction){
        return (
            //mx-auto:左右余白auto max-w-4xl:横幅制限 p-6:padding grid:デフォルト動作で縦並び gap-6:Card間間隔
            <div className="mx-auto max-w-4xl p-6 grid gap-6">
                <h2>詳細</h2>
                <p className="border-b border-slate-100 px-3 py-2 text-right tabular-nums">データが見つかりません（id:{id}）</p>
                <a href="/" className="underline underline-offset-4 hover:text-lime-200">一覧へ戻る</a>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-6 grid gap-6">
            <h2 className="text-lg font-semibold">詳細 </h2>

            {
                isEditing ? (
                    <div className="grid gap-3">
                        <TransactionForm mode="edit" detailDraft={transaction} onSave={onSaveEdit} />
                        <button 
                            className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            onClick={onCancelEdit}
                            type="button"
                        >
                            キャンセル
                        </button> 
                    </div>

                ) : (
                    <div className="grid gap-6">
                        {/* grid-cols-[80px_16px_1fr]:横に3列(左から80px,16px,残り全部) gap-y-2:行間 rounded-lg:角丸 border-slate-200:薄グレー枠線 p-4:内側余白*/}
                        <dl className="grid grid-cols-[80px_16px_1fr] gap-y-2 rounded-lg border border-slate-200 p-4">
                            <dt className="font-medium test-slate-700">日付</dt>
                            <dd className="test-slate-700">：</dd>
                            <dd className="test-slate-700">{transaction.date}</dd>
                            <dt className="font-medium test-slate-700">収支</dt>
                            <dd className="test-slate-700">：</dd>
                            <dd className="test-slate-700">{transaction.type === "income" ? "収入" : "支出"}</dd>
                            <dt className="font-medium test-slate-700">カテゴリ</dt>
                            <dd className="test-slate-700">：</dd>
                            <dd className="test-slate-700">{transaction.categoryId}</dd>
                            <dt className="font-medium test-slate-700">金額</dt>
                            <dd className="test-slate-700">：</dd>
                            <dd className="test-slate-700">{transaction.amount}</dd>
                            <dt className="font-medium test-slate-700">メモ</dt>
                            <dd className="test-slate-700">：</dd>
                            <dd className="test-slate-700">{transaction.title}</dd>
                        </dl>
                    
                        <div className="grid gap-3">
                            <button
                                className="mt-2 rounded-md bg-slate-700 px-1 py-2 text-sm font-semibold text-white hover:bg-slate-500"
                                onClick={onStartEdit}
                                type="button"
                            >
                                編集
                            </button>
                            <br />
                            <a href="/" className="underline underline-offset-4 hover:text-lime-200">
                                一覧へ戻る
                            </a>
                        </div>
                    </div>    
                )}
        </div>
    );
}