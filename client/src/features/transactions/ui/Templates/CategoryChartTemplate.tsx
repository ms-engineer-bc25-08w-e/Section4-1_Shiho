import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

interface ChartData {
  name: string;
  value: number;
}

interface Props {
  data: ChartData[];
  title?: string;
}

export const CategoryChartTemplate: React.FC<Props> = ({ data, title = "支出の内訳" }) => {
  return (
    <div className="w-full p-6 border rounded-lg shadow-sm bg-white text-gray-900">
      <h3 className="text-xl font-bold mb-6 border-b pb-2">{title}</h3>

      {/* gap-1 でグラフとリストの間に隙間を作る */}
      <div className="flex flex-col md:flex-row items-center gap-1">
        {/* 左側：グラフ */}
        <div className="w-full md:w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50} // 少しドーナツを細くしてスッキリさせる
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 右側：金額リスト（文字を濃く、大きくする） */}
        <div className="w-full md:w-1/2">
          <ul className="space-y-3">
            {data.map((item, index) => (
              <li key={item.name} className="flex justify-between items-center text-base border-b border-gray-50 pb-1">
                <div className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">¥{item.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
