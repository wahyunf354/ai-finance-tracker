import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface TransactionStatsProps {
  income: number;
  expense: number;
}

export function TransactionStats({ income, expense }: TransactionStatsProps) {
  const balance = income - expense;
  const isPositive = balance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground break-words">
            {formatRupiah(income)}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground break-words">
            {formatRupiah(expense)}
          </div>
        </CardContent>
      </Card>
      <Card
        className={
          isPositive
            ? "bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20 shadow-none"
            : "bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20 shadow-none"
        }
      >
        <CardContent className="p-4">
          <div
            className={`flex items-center gap-2 mb-2 ${
              isPositive ? "text-blue-500" : "text-amber-500"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Saldo tersisa</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground break-words">
            {formatRupiah(balance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
