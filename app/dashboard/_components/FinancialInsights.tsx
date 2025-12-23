"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FinancialInsightsProps {
  savingsRate: number;
}

export function FinancialInsights({ savingsRate }: FinancialInsightsProps) {
  return (
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
            <div className="text-3xl font-black">{savingsRate.toFixed(1)}%</div>
            <div className="text-[10px] pb-1 text-muted-foreground">
              of your total income
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savingsRate}%` }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Tip for today
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-indigo-500 pl-3">
            &quot;You&apos;re saving {savingsRate.toFixed(0)}% of your income.
            Increasing this by just 5% could help you reach your financial goals
            20% faster!&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
