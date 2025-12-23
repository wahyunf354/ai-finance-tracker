import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface TransactionStatsProps {
  income: number;
  expense: number;
}

export function TransactionStats({ income, expense }: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <div className="text-2xl font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
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
          <div className="text-2xl font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {formatRupiah(expense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
