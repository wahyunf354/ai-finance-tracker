"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import { formatRupiah, formatCompactNumber } from "@/lib/utils";

import { ChartDataItem } from "@/types";

interface SpendingActivityProps {
  data: ChartDataItem[];
}

export function SpendingActivity({ data }: SpendingActivityProps) {
  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden min-h-[350px]">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Spending Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#666" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#666" }}
              tickFormatter={(val) => formatCompactNumber(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
              formatter={(value: number | string | undefined) => [
                formatRupiah(Number(value || 0)),
                "",
              ]}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
