import type { Transaction } from "../../types/transaction";
import Link from "next/link";

type Props = {
    transactions: Transaction[] ; //「このコンポーネントは入出金データの一覧を受け取ります」という契約書(型定義)
    getDetailHref:(id:string) => string; //transactionsのid(id:string)を引数として受け取りリンク用のURLを文字列型(string)で返す関数
    onDelete: (id: string) => void; //削除用
} ;

 //transactionsの中身を変数として取り出す(関数の引数)
export default function TransactionTable ({transactions,getDetailHref,onDelete}:Props) {
    return (
        <div > {/* 横方向に伸びる */}
            {/* w-full:width:100%、border-separate:セルの境界線を分ける、border-spacing-0:セルとセルの間隔を0、text-sm:文字サイズ小さめ */}
            <table className="w-full border-separate border-spacing-0 text-sm">
                <thead>
                    <tr>
                        {/* border-b:下線表示、border-slate-200:下線薄グレー、bg-slate-50:背景色薄いグレー、px-3:左右の余白(padding)、py-2:上下余白、text-left:テキスト左寄せ、font-semibold:文字やや太字 */}
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">日付</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">収支</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">カテゴリ</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">金額</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">メモ</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">詳細</th>
                        <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">削除</th>
                    </tr>
                </thead>

                <tbody>
                    {/* .map=配列の要素を1つずつ順番に取り出して新しい配列を作る */}
                    {transactions.map((t) => (
                        <tr key={t.id} >
                            <td className="border-b border-slate-100 px-3 py-2">{t.date}</td>
                            <td className="border-b border-slate-100 px-3 py-2">{t.type === "income" ? "収入" : "支出"}</td>
                            <td className="border-b border-slate-100 px-3 py-2">{t.categoryName ?? t.categoryId}</td>
                            
                            <td className="border-b border-slate-100 px-3 py-2">{t.amount.toLocaleString()}&nbsp;円</td>
                            <td className="border-b border-slate-100 px-3 py-2 whitespace-normal break-words">{t.title}</td>
                            <td className="border-b border-slate-100 px-3 py-2">
                                {/* underline:文字下線、underline-offset-4:下線と文字の間隔を広げる、hover:text-lime-300:マウスを乗せたとき薄ライム */}
                                <Link className="underline underline-offset-4 hover:text-lime-300" href={getDetailHref(t.id)} title={t.id}>編集</Link>
                            </td>
                            <td className="border-b border-slate-100 px-3 py-2">
                                <button
                                type="button"
                                className="rounded-md border px-2 py-1 text-sm hover:bg-slate-500"
                                onClick={() => onDelete(t.id)}
                                >
                                削除
                                </button>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )

};
