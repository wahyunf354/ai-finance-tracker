import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Transaction } from "@/types";
import * as ExcelJS from "exceljs";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense };
  }, [transactions]);

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
        setTransactions((prev) =>
          prev.filter((t) => t.id !== deletingTransactionId)
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
        setTransactions((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
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

  return {
    transactions,
    filtered,
    loading,
    search,
    setSearch,
    editingTransaction,
    setEditingTransaction,
    deletingTransactionId,
    setDeletingTransactionId,
    stats,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleUpdate,
    exportToExcel,
  };
}
