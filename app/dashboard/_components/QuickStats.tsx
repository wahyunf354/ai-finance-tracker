"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface QuickStatsProps {
  stats: {
    balance: number;
    totalIncome: number;
    totalExpense: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
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
  );
}
