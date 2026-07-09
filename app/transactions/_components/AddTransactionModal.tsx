import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STANDARD_CATEGORIES } from "@/lib/categories";
import { useLanguage } from "@/context/LanguageContext";

export type NewTransactionForm = {
  description: string;
  amount: number | "";
  date: string;
  category: string;
  type: "income" | "expense";
};

interface AddTransactionModalProps {
  isOpen: boolean;
  form: NewTransactionForm;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (updates: NewTransactionForm) => void;
}

export function AddTransactionModal({
  isOpen,
  form,
  onClose,
  onSubmit,
  onChange,
}: AddTransactionModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
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
                {t.history.add_title}
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
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.history.description}
                </label>
                <Input
                  required
                  value={form.description}
                  onChange={(e) =>
                    onChange({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.history.amount}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.amount}
                    onChange={(e) =>
                      onChange({
                        ...form,
                        amount:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.history.date}
                  </label>
                  <Input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      onChange({ ...form, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.history.category}
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={form.category}
                    onChange={(e) =>
                      onChange({ ...form, category: e.target.value })
                    }
                  >
                    {STANDARD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.history.type}
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={form.type}
                    onChange={(e) =>
                      onChange({
                        ...form,
                        type: e.target.value as "income" | "expense",
                      })
                    }
                  >
                    <option value="expense">{t.common.expense}</option>
                    <option value="income">{t.common.income}</option>
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
                  {t.history.cancel}
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  <Check className="h-4 w-4" />
                  {t.history.save}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
