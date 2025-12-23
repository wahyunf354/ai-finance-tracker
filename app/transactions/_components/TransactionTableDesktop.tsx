import { Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { cn, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TransactionTableDesktopProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTableDesktop({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableDesktopProps) {
  return (
    <div className="hidden md:block">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-md z-10">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-muted/30 transition-colors group"
            >
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 opacity-50" />
                  {format(new Date(t.date), "d MMM yyyy")}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                {t.description}
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  {t.category}
                </span>
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right font-bold",
                  t.type === "income" ? "text-green-500" : "text-red-500"
                )}
              >
                {t.type === "income" ? "+" : "-"}
                {formatRupiah(t.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                    onClick={() => onEdit(t)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => onDelete(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
