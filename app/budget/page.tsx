"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatRupiah } from "@/lib/utils";
import { Loader2, Plus, Wand2, Calculator, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Budget = {
  id?: string;
  category: string;
  amount: number;
};

type BudgetStatus = {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  status: "safe" | "warning" | "danger";
};

export default function BudgetPage() {
  const { t } = useLanguage();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Edit State
  const [editingCategory, setEditingCategory] = useState("");
  const [editingAmount, setEditingAmount] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetRes, txRes] = await Promise.all([
        fetch("/api/budgets"),
        fetch("/api/transactions"),
      ]);

      const budgetData = await budgetRes.json();
      const txData = await txRes.json();

      if (budgetRes.ok) setBudgets(budgetData);
      if (txRes.ok) setTransactions(txData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const budgetStats: BudgetStatus[] = useMemo(() => {
    if (!budgets.length) return [];

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 1. Calculate spending per category for this month
    const spendingMap: Record<string, number> = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        t.type === "expense"
      ) {
        spendingMap[t.category] = (spendingMap[t.category] || 0) + t.amount;
      }
    });

    // 2. Map to Status
    return budgets
      .map((b) => {
        const spent = spendingMap[b.category] || 0;
        const percentage = (spent / b.amount) * 100;
        let status: "safe" | "warning" | "danger" = "safe";

        if (percentage >= 100) status = "danger";
        else if (percentage >= 80) status = "warning";

        return {
          category: b.category,
          limit: b.amount,
          spent,
          percentage,
          status,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, transactions]);

  const handleSmartBudget = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/budgets/suggest", { method: "POST" });
      const data = await res.json();

      if (data.budgets) {
        // Automatically save suggested budgets
        for (const b of data.budgets) {
          await fetch("/api/budgets", {
            method: "POST",
            body: JSON.stringify(b),
          });
        }
        await fetchData();
        toast.success(t.budget_page.toasts.generated);
      }
    } catch (error) {
      toast.error(t.budget_page.toasts.generate_error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSaveBudget = async () => {
    if (!editingCategory || !editingAmount) return;

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify({
          category: editingCategory,
          amount: parseFloat(editingAmount),
        }),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        fetchData();
        toast.success(t.budget_page.toasts.saved);
        setEditingAmount("");
        setEditingCategory("");
        setIsEditMode(false);
      }
    } catch (error) {
      toast.error(t.budget_page.toasts.save_error);
    }
  };

  const handleDeleteBudget = async (category: string) => {
    if (!confirm(t.budget_page.confirm_delete)) return;
    try {
      const res = await fetch(
        `/api/budgets?category=${encodeURIComponent(category)}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        fetchData();
        toast.success(t.budget_page.toasts.deleted);
      }
    } catch (error) {
      toast.error(t.budget_page.toasts.delete_error);
    }
  };

  const openAddDialog = () => {
    setEditingCategory("");
    setEditingAmount("");
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (stat: BudgetStatus) => {
    setEditingCategory(stat.category);
    setEditingAmount(stat.limit.toString());
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-6 pt-6 px-4 pb-24 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          {t.budget_page.title}
        </h1>
        <Button
          variant="outline"
          onClick={handleSmartBudget}
          disabled={isSuggesting}
          className="gap-2 border-primary/20 hover:bg-primary/10 text-primary"
        >
          {isSuggesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {t.budget_page.auto_set}
        </Button>
      </div>

      <Card className="border-none bg-primary/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <Wand2 className="h-6 w-6 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">
            {t.budget_page.description}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" onClick={openAddDialog}>
                <Plus className="h-4 w-4" /> {t.budget_page.add_custom}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.budget_page.dialog_title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t.budget_page.category}</Label>
                  <Input
                    placeholder={t.budget_page.category_placeholder}
                    value={editingCategory}
                    onChange={(e) => setEditingCategory(e.target.value)}
                    disabled={isEditMode}
                  />
                  {/* Ideally select from existing categories */}
                </div>
                <div className="space-y-2">
                  <Label>{t.budget_page.amount}</Label>
                  <Input
                    type="number"
                    placeholder="2000000"
                    value={editingAmount}
                    onChange={(e) => setEditingAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveBudget} className="w-full">
                  {t.budget_page.save}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>{t.budget_page.loading}</p>
          </div>
        ) : budgetStats.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <p>{t.budget_page.empty}</p>
            <p className="text-sm mt-1">{t.budget_page.empty_hint}</p>
          </div>
        ) : (
          <AnimatePresence>
            {budgetStats.map((stat) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="group relative overflow-hidden border-none shadow-sm ring-1 ring-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-end mb-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                          {stat.category}
                        </h3>
                        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEditDialog(stat)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteBudget(stat.category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatRupiah(stat.spent)} /{" "}
                          <span className="text-foreground font-medium">
                            {formatRupiah(stat.limit)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold px-2 py-1 rounded-full ${
                          stat.status === "danger"
                            ? "bg-red-500/10 text-red-500"
                            : stat.status === "warning"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {Math.round(stat.percentage)}%
                      </div>
                    </div>
                    <Progress
                      value={Math.min(stat.percentage, 100)}
                      className={`h-2 ${
                        stat.status === "danger"
                          ? "[&>div]:bg-red-500"
                          : stat.status === "warning"
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                      }`}
                    />
                    {stat.status === "danger" && (
                      <p className="text-[10px] text-red-500 mt-2 font-medium flex items-center gap-1">
                        ⚠️ {t.budget_page.exceeded}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
