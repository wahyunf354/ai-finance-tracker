import { Calendar, Edit, Trash2, ReceiptText } from "lucide-react";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { cn, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <>
      <Dialog
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-primary" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-start border-b pb-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg leading-none">
                    {selectedTx.description}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedTx.date), "dd MMMM yyyy")}
                  </p>
                </div>
                <div
                  className={cn(
                    "font-bold text-lg",
                    selectedTx.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {selectedTx.type === "income" ? "+" : "-"}
                  {formatRupiah(selectedTx.amount)}
                </div>
              </div>

              {/* Items List */}
              {selectedTx.items && selectedTx.items.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Itemized Receipt
                  </h4>
                  <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
                    {selectedTx.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm gap-4"
                      >
                        <span className="flex-1 text-foreground/90">
                          <span className="font-medium text-muted-foreground mr-1">
                            {item.quantity}x
                          </span>
                          {item.name}
                        </span>
                        <span className="font-medium tabular-nums">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-2">
                  No itemized details available.
                </p>
              )}

              {/* Tax & Discount */}
              {(selectedTx.tax || selectedTx.discount) && (
                <div className="border-t pt-2 space-y-1.5 text-sm">
                  {selectedTx.tax ? (
                    <div className="flex justify-between text-red-500/80">
                      <span>Tax</span>
                      <span>+{formatRupiah(selectedTx.tax)}</span>
                    </div>
                  ) : null}
                  {selectedTx.discount ? (
                    <div className="flex justify-between text-green-500/80">
                      <span>Discount</span>
                      <span>-{formatRupiah(selectedTx.discount)}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="hidden md:block overflow-x-auto pb-2">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
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
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap w-[140px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 opacity-50" />
                    {format(new Date(t.date), "d MMM yyyy")}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span
                      title={t.description}
                      className="truncate max-w-[200px] block"
                    >
                      {t.description}
                    </span>
                    {t.items && t.items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-primary opacity-70 hover:opacity-100"
                        onClick={() => setSelectedTx(t)}
                        title="View Receipt Details"
                      >
                        <ReceiptText className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
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
                <td className="px-4 py-3 text-right w-[100px]">
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
    </>
  );
}
