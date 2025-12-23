"use client";

import { useEffect, useState } from "react";

import {
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import * as ExcelJS from "exceljs";
import { cn, formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Transaction = {
  id: string;
  created_at: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      console.log("data", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Transactions");

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Type", key: "type", width: 10 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    transactions.forEach((t) => {
      sheet.addRow(t);
    });

    // Stylize header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCCCCC" },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleDelete = (id: string) => {
    setDeletingTransactionId(id);
  };

  const confirmDelete = async () => {
    if (!deletingTransactionId) return;
    try {
      const res = await fetch(`/api/transactions?id=${deletingTransactionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTransactions(
          transactions.filter((t) => t.id !== deletingTransactionId)
        );
        toast.success("Transaction deleted successfully");
        setDeletingTransactionId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTransaction),
      });

      if (res.ok) {
        const updated = await res.json();
        setTransactions(
          transactions.map((t) => (t.id === updated.id ? updated : t))
        );
        setEditingTransaction(null);
        toast.success("Transaction updated successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-6 pt-4 px-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <Button
          onClick={exportToExcel}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Income</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Expenses</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card className="flex-1 flex flex-col min-h-0 border bg-card shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-input"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <>
              {/* Mobile View (Cards) */}
              <div className="block md:hidden">
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {filtered.map((t) => (
                      <div
                        key={t.id}
                        className="relative overflow-hidden group"
                      >
                        {/* Swipe Actions Background */}
                        <div className="absolute inset-y-0 right-0 flex items-stretch">
                          <button
                            onClick={() => handleEdit(t)}
                            className="w-[70px] bg-blue-500 text-white flex flex-col items-center justify-center gap-1 active:bg-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="text-[10px] font-medium">
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-[70px] bg-red-500 text-white flex flex-col items-center justify-center gap-1 active:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-[10px] font-medium">
                              Delete
                            </span>
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
                                t.type === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
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

              {/* Desktop View (Table) */}
              <div className="hidden md:block">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-md z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Amount
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 opacity-50" />
                            {t.date}
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
                            t.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {t.type === "income" ? "+" : "-"}$
                          {formatRupiah(t.amount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                              onClick={() => handleEdit(t)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              onClick={() => handleDelete(t.id)}
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
          )}
        </ScrollArea>
      </Card>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTransaction(null)}
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
                  onClick={() => setEditingTransaction(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    required
                    value={editingTransaction.description}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      required
                      value={editingTransaction.amount}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
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
                      value={editingTransaction.date}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      required
                      value={editingTransaction.category}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={editingTransaction.type}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
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
                    onClick={() => setEditingTransaction(null)}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingTransactionId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingTransactionId(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border shadow-xl rounded-2xl overflow-hidden p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Delete Transaction?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. This will permanently delete the
                transaction record.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeletingTransactionId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
