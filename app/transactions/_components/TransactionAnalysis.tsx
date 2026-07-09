"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Transaction } from "@/types";
import { formatRupiah, formatCompactNumber } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

interface TransactionAnalysisProps {
  transactions: Transaction[];
}

interface ChartDataItem {
  date: string;
  dateLabel: string;
  income: number;
  expense: number;
}

export function TransactionAnalysis({
  transactions,
}: TransactionAnalysisProps) {
  const {
    totalIncome,
    totalExpense,
    balance,
    byCategory,
    categoryTotal,
    chartData,
  } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const byCat: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCat[t.category] = (byCat[t.category] || 0) + t.amount;
      });
    const categoryTotal = Object.values(byCat).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

    const byDate: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const key = t.date;
      if (!byDate[key]) byDate[key] = { income: 0, expense: 0 };
      if (t.type === "income") byDate[key].income += t.amount;
      else byDate[key].expense += t.amount;
    });
    const chartData: ChartDataItem[] = Object.entries(byDate)
      .map(([date, { income: i, expense: e }]) => ({
        date,
        dateLabel: format(new Date(date), "dd MMM", { locale: id }),
        income: i,
        expense: e,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      byCategory: sorted,
      categoryTotal,
      chartData,
    };
  }, [transactions]);

  return (
    <div className="space-y-4 px-2">
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-green-600 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Pemasukan</span>
            </div>
            <p className="text-sm font-bold text-foreground truncate">
              {formatRupiah(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-red-600 mb-1">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Pengeluaran</span>
            </div>
            <p className="text-sm font-bold text-foreground truncate">
              {formatRupiah(totalExpense)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Saldo</span>
            </div>
            <p
              className={`text-sm font-bold truncate ${
                balance >= 0 ? "text-foreground" : "text-amber-600"
              }`}
            >
              {formatRupiah(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                Chart Pemasukan & Pengeluaran
              </span>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="analysisExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="analysisIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted/50"
                  />
                  <XAxis
                    dataKey="dateLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(val) => formatCompactNumber(val)}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as ChartDataItem | undefined)
                        ?.dateLabel ?? ""
                    }
                    formatter={(value, name) => [
                      formatRupiah(Number(value ?? 0)),
                      name,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#analysisExpense)"
                    animationDuration={800}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Pemasukan"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#analysisIncome)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {byCategory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <PieChart className="h-4 w-4" />
              <span className="text-sm font-medium">
                Pengeluaran per kategori
              </span>
            </div>
            <div className="space-y-3">
              {byCategory.map(([name, value]) => {
                const pct =
                  categoryTotal > 0 ? (value / categoryTotal) * 100 : 0;
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate pr-2">{name}</span>
                      <span className="text-muted-foreground shrink-0">
                        {formatRupiah(value)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Tidak ada data untuk dianalisis. Ubah filter atau tambah transaksi.
        </p>
      )}
    </div>
  );
}
