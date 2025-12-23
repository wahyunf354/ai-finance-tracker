import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (updates: Transaction) => void;
}

export function EditModal({
  transaction,
  onClose,
  onUpdate,
  onChange,
}: EditModalProps) {
  return (
    <AnimatePresence>
      {transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border shadow-lg rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <h2 className="font-semibold text-foreground">
                Edit Transaction
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={onUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  required
                  value={transaction.description}
                  onChange={(e) =>
                    onChange({ ...transaction, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    required
                    value={transaction.amount}
                    onChange={(e) =>
                      onChange({
                        ...transaction,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    required
                    value={transaction.date}
                    onChange={(e) =>
                      onChange({ ...transaction, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    required
                    value={transaction.category}
                    onChange={(e) =>
                      onChange({ ...transaction, category: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={transaction.type}
                    onChange={(e) =>
                      onChange({
                        ...transaction,
                        type: e.target.value as "income" | "expense",
                      })
                    }
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
