"use client";

import { useDashboardData } from "./_hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Calendar,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

export default function DashboardPage() {
  const { loading, stats, categoryData, chartData, topExpenses } =
    useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6 pt-2 pb-24 overflow-y-auto px-4 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Financial Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor your spending behavior
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Total Balance
              </span>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatRupiah(stats.balance)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Available funds in your wallet
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 shadow-none">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
                Total Income
              </span>
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatRupiah(stats.totalIncome)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Total money coming in
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 shadow-none">
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                Total Expenses
              </span>
              <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {formatRupiah(stats.totalExpense)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Total money going out
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
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
                data={chartData}
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
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
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

        {/* Categories Pie Chart */}
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
                        paddingAngle={8}
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
                <div className="w-full space-y-3">
                  {categoryData.slice(0, 5).map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-2.5 w-2.5 rounded-full shadow-sm"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[100px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[12px] font-bold tabular-nums">
                        {formatRupiah(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-50">
                No financial data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expenses List */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
              Largest Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {topExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {expense.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground capitalize">
                        {expense.category} • {expense.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-red-500">
                    -{formatRupiah(expense.amount)}
                  </div>
                </div>
              ))}
              {topExpenses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                  No transactions recorded
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insights / Budget Tips */}
        <Card className="border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">
              Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                Savings Rate
              </div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-black">
                  {stats.savingsRate.toFixed(1)}%
                </div>
                <div className="text-[10px] pb-1 text-muted-foreground">
                  of your total income
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.savingsRate}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Tip for today
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                &quot;You&apos;re saving {stats.savingsRate.toFixed(0)}% of your
                income. Increasing this by just 5% could help you reach your
                financial goals 20% faster!&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
