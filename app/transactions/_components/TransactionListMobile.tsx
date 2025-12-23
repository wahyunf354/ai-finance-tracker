import { Calendar, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { cn, formatRupiah } from "@/lib/utils";

interface TransactionListMobileProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionListMobile({
  transactions,
  onEdit,
  onDelete,
}: TransactionListMobileProps) {
  return (
    <div className="block md:hidden">
      <div className="divide-y divide-border">
        <AnimatePresence>
          {transactions.map((t) => (
            <div key={t.id} className="relative overflow-hidden group">
              {/* Swipe Actions Background */}
              <div className="absolute inset-y-0 right-0 flex items-stretch">
                <button
                  onClick={() => onEdit(t)}
                  className="w-[70px] bg-blue-500 text-white flex flex-col items-center justify-center gap-1 active:bg-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="w-[70px] bg-red-500 text-white flex flex-col items-center justify-center gap-1 active:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Delete</span>
                </button>
              </div>

              {/* Transaction Content */}
              <motion.div
                drag="x"
                dragConstraints={{ left: -140, right: 0 }}
                dragElastic={0.1}
                className="relative p-4 flex flex-col gap-2 bg-card hover:bg-muted/30 transition-colors z-10 touch-pan-y"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground line-clamp-2 pr-2">
                    {t.description}
                  </span>
                  <span
                    className={cn(
                      "font-bold whitespace-nowrap",
                      t.type === "income" ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatRupiah(t.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {t.date}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
                    {t.category}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
