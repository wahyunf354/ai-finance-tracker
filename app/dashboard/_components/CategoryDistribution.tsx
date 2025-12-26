"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatRupiah } from "@/lib/utils";

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

import { CategoryDataItem } from "@/types";

interface CategoryDistributionProps {
  categoryData: CategoryDataItem[];
}

export function CategoryDistribution({
  categoryData,
}: CategoryDistributionProps) {
  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden min-h-[350px]">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-pink-500" />
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[320px] flex flex-col items-center justify-center">
        {categoryData.length > 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-full h-[200px] ">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    minAngle={2}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number | string | undefined) =>
                      formatRupiah(Number(value || 0))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {categoryData.map((item, index) => {
                const total = categoryData.reduce(
                  (acc, curr) => acc + curr.value,
                  0
                );
                const percentage = ((item.value / total) * 100).toFixed(1);

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between group cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full shadow-sm shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {percentage}%
                      </span>
                      <span className="text-[12px] font-bold tabular-nums">
                        {formatRupiah(item.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-50">
            No financial data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
