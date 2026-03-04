"use client";

import { format } from "date-fns";
import { Transaction } from "@/types";
import { cn, formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react";

interface TransactionCardsProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionCards({
  transactions,
  onEdit,
  onDelete,
}: TransactionCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
      {transactions.map((t) => (
        <Card
          key={t.id}
          className={cn(
            "overflow-hidden transition-shadow hover:shadow-md",
            t.type === "income"
              ? "border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5"
              : "border-red-500/20 bg-gradient-to-br from-red-500/5 to-rose-500/5",
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(t.date), "dd MMM yyyy")} · {t.category}
                </p>
                <p
                  className={cn(
                    "font-semibold mt-2 text-sm",
                    t.type === "income" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {t.type === "income" ? (
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />+
                      {formatRupiah(t.amount)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5" />-
                      {formatRupiah(t.amount)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(t)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
