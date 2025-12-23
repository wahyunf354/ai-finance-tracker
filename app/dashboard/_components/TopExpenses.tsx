"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Layers } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Transaction } from "@/types";

interface TopExpensesProps {
  topExpenses: Transaction[];
}

export function TopExpenses({ topExpenses }: TopExpensesProps) {
  return (
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
  );
}
