
type MonthlyItems ={
    month: string; // "2025-12"みたいな形式を想定
    income: number;
    expense: number;
    result: number; //income - expense
};

type Props = {
    rows: MonthlyItems[];
};

export default function MonthlySummaryTable(
    {rows}: Props
){
    return (
        <div className="overflow-x-auto grid gap-4"> {/* 横方向に伸びる */}
        <h2 className="text-lg font-semibold">合計</h2>

        {/* w-full:width:100%、border-separate:セルの境界線を分ける、border-spacing-0:セルとセルの間隔を0、text-sm:文字サイズ小さめ */}
        <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
                <tr>
                    {/* border-b:下線表示、border-slate-200:下線薄グレー、bg-slate-50:背景色薄いグレー、px-3:左右の余白(padding)、py-2:上下余白、text-right:文字右寄せ、font-semibold:文字やや太字 */}
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-black">月合計</th>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold text-black">収入合計</th>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold text-black">支出合計</th>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold text-black">差額</th>
                </tr>
            </thead>

            <tbody>
                {/* .map=配列の要素を1つずつ順番に取り出して新しい配列を作る */}
                {
                    rows.map((r) => ( //rowから取り出したrを受け取って以降で返す
                        <tr key={r.month}>
                            <td className="border-b border-slate-100 px-3 py-2">{r.month}</td>
                            <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums" >{r.income}</td>{/* tabular-nums:数字の幅を揃える */}
                            <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums">{r.expense}</td>
                            <td className="border-b border-slate-100 px-3 py-2 text-right tabular-nums">{r.result}</td>
                         </tr>
                    ))
                }

            </tbody>

        </table>
    </div>
);

};
