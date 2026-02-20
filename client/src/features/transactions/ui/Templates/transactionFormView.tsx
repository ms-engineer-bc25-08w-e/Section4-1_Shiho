import type { TransactionType, Draft, Category } from "@/features/transactions/types/transaction";

type Props ={
    mode: "add" | "edit";
    draft: Draft;
    categories: Category[]; 
    onChange: (key: keyof Draft, value: string | number) => void; // onChange関数を受け取る。イメージonChange("title", "ランチ代")
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // onSubmit関数を受け取る。<form>がsubmitされたときに実行されるイベントハンドラ関数。
};

export default function TransactionFormView ({mode,draft,categories,onChange,onSubmit}: Props){
    return (
        <form
            onSubmit={(e) => {console.log("FORM SUBMIT fired"); onSubmit(e); }} className="grid gap-4"
        >
     <h1 className="text-2x1 font-bold">家計簿</h1>  {/* text-2x1:文字サイズ font-bold:太字 */}

     <div className="grid grid-1">
         <label className="text-sm font-medium">
             日付
         </label>
         {/* rounded-md:角丸み*/}
         <input 
             className="w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm text-black " 
             type="date"
             value={draft.date}
             onChange={(e)=>onChange("date",e.target.value)}  //e=event 入力された瞬間にReactのonChangeイベントが行われ結果がeに詰め込まれる
          />          
     </div>    

     <div className="grid grid-1">
         <label className="text-sm font-medium">
             収支
         </label>
         <select
             className="w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm text-black"
             value={draft.type}
             onChange={(e)=>onChange("type",e.target.value as TransactionType)}>
             <option value="income">収入</option>
             <option value="expense">支出</option>
         </select>
     </div>

     <div className="grid grid-1">
         <label className="text-sm font-medium">
             カテゴリ
         </label>
         <select
             className="w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm text-black"
             value={draft.categoryId}
             onChange={(e)=>onChange("categoryId",e.target.value)}>
             <option value="">カテゴリを選択</option>
             {categories.map((c) => (
                 <option key={c.id} value={c.id}>
                     {c.name}
                 </option>
             )
             )}
         </select>
     </div>

     <div className="grid grid-1">
         <label className="text-sm font-medium">
             メモ
         </label>
         <input
             className="w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm text-black"
             value={draft.title}
             onChange={(e)=>onChange("title",e.target.value)}
             placeholder="例：忘年会"
         />
     </div>

     <div className="grid grid-1">
         <label className="text-sm font-medium">
             金額
         </label>
         <input
             className="w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm text-black"
             type="number"
             value={draft.amount}
             onChange={(e)=> onChange("amount",Number(e.target.value))}
             min={0}
         />
     </div>

     <button
         type="submit"
         className="mt-2 rounded-md bg-slate-700 px-1 py-2 text-sm font-semibold text-white hover:bg-slate-500"
     >
         {mode === "edit" ? "保存":"登録"}
     </button>

</form>
            
)

};
