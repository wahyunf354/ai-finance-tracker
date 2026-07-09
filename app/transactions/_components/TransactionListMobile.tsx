import { Calendar, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { cn, formatRupiah } from "@/lib/utils";
import { useState } from "react";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="block md:hidden">
      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {transactions.map((t) => (
            <div key={t.id} className="relative overflow-hidden group">
              {/* Swipe Actions Background */}
              <div className="absolute inset-y-0 right-0 flex items-stretch">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(t);
                  }}
                  className="w-[70px] bg-blue-500 text-white flex flex-col items-center justify-center gap-1 active:bg-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(t.id);
                  }}
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
                className="relative bg-card hover:bg-muted/30 transition-colors z-10 touch-pan-y"
              >
                <div
                  className="px-4 py-3 flex flex-col gap-2 cursor-pointer"
                  onClick={() => toggleExpand(t.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-foreground line-clamp-2 pr-2">
                      {t.description}
                    </span>
                    <span
                      className={cn(
                        "font-bold whitespace-nowrap shrink-0 ml-2",
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
                      {format(new Date(t.date), "d MMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
                        {t.category}
                      </span>
                      {expandedId === t.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === t.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 overflow-hidden bg-muted/10 border-t border-border/50"
                    >
                      <div className="pt-3 space-y-2 text-sm">
                        {t.items && t.items.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                              Items
                            </p>
                            <ul className="space-y-1">
                              {t.items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between gap-2 text-foreground/80"
                                >
                                  <span className="flex-1 break-words">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>{formatRupiah(item.price)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(t.tax || t.discount) && (
                          <div className="pt-2 border-t border-border/50 space-y-1">
                            {t.tax && t.tax > 0 && (
                              <div className="flex justify-between text-red-500/80">
                                <span>Tax</span>
                                <span>+{formatRupiah(t.tax)}</span>
                              </div>
                            )}
                            {t.discount && t.discount > 0 && (
                              <div className="flex justify-between text-green-500/80">
                                <span>Discount</span>
                                <span>-{formatRupiah(t.discount)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {(!t.items || t.items.length === 0) &&
                          !t.tax &&
                          !t.discount && (
                            <p className="text-muted-foreground italic text-xs">
                              No details available
                            </p>
                          )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
