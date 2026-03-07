import type { Transaction } from "@/features/transactions/types/transaction";
import {useMemo} from "react";
import MonthlySummaryTable from "@/features/transactions/ui/Templates/monthlySummaryList";

type Props = {
    transactions: Transaction[];
};

type MonthlyItems ={
    month: string; // "2025-12"みたいな形式を想定
    income: number;
    expense: number;
    result: number; //income - expense
}

const MonthlySummary = ({transactions}:Props) => {
    const rows = useMemo<MonthlyItems[]>(() => {
        const map = new Map <string,{income:number,expense:number}>();//Map型。Map<キーの型,値の型>

        for(let t of transactions){
            const month = t.date.slice(0,7); //"2025-12"みたいな形式を想定
            const current = map.get(month) ?? {income:0,expense:0}; //monthに対応する値を取得。0は当該月が無い時の初期値。

            if(t.type === "income")current.income += t.amount;
            else current.expense += t.amount;

            map.set(month,current); //Mapに保存
        }


        return Array.from(map.entries()).map(([month,value])=>({ //キーと値のペアを順番に取り出す。分割代入。
                month,
                income:value.income,
                expense:value.expense,
                result:value.income - value.expense,
            }));
    },[transactions]);

   
return (
    <div className="grid gap-4">
        <MonthlySummaryTable rows={rows} />
    </div>
);

};

export default MonthlySummary;