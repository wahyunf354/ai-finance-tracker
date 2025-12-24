import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Transaction, UserProfile } from "@/types";
import * as ExcelJS from "exceljs";
import { exportToPDF } from "@/lib/export-pdf";

// Simple debounce hook implementation if package not available
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 500);

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Categories should presumably still be unique from loaded transactions? behavior might change if not all loaded.
  // For now, let's keep accumulating them or maybe better: fetch categories separately?
  // If we only show categories from *loaded* transactions, user might not find a category to filter by if it's on page 2.
  // Ideally we should have a separate /api/categories endpoint.
  // But for now let's derive from current transactions + maybe list from budget?
  // Let's stick to current transactions for simplicity as "all loaded so far".
  // OR better: The previous implementation derived it from `transactions`.
  // Since we now paginate, `transactions` only has a subset.
  // Let's assume unique categories are derived from the *current view* or we accept this limitation for now.
  const categories = useMemo(() => {
    const cats = Array.from(new Set(transactions.map((t) => t.category)));
    return ["all", ...cats];
  }, [transactions]);

  const fetchTransactions = useCallback(
    async (currentPage: number, reset: boolean = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
          search: debouncedSearch,
          type: filterType,
          category: filterCategory,
          from: dateRange.from,
          to: dateRange.to,
          sortBy: sortBy,
        });

        const res = await fetch(`/api/transactions?${params.toString()}`);
        const payload = await res.json();

        if (!res.ok) throw new Error(payload.error || "Failed to fetch");

        const newTransactions = payload.data || [];
        const meta = payload.meta;

        setTransactions((prev) =>
          reset ? newTransactions : [...prev, ...newTransactions]
        );
        setTotal(meta.total);
        setHasMore(newTransactions.length === 20); // If we got full limit, likely more exists
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, filterType, filterCategory, dateRange, sortBy]
  );

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Initial Load & Filter Changes
  useEffect(() => {
    setPage(1);
    fetchTransactions(1, true);
  }, [fetchTransactions]);
  // Note: fetchTransactions depends on filters, so this runs when filters change

  useEffect(() => {
    fetchUser();
  }, []);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, false);
  };

  const stats = useMemo(() => {
    // Note: Stats calculation now only reflects *loaded* transactions.
    // Ideally backend should return global stats.
    // For this refactor, we accept this limitation or we need another API call for aggregate stats.
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
        // If total is tracked, decrement it
        setTotal((prev) => prev - 1);
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
    filtered: transactions, // mapping filtered to transactions so UI doesn't break
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    categories,
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
    handleExportPDF: () => {
      if (!user?.is_premium) {
        toast.error("Premium required", {
          description: "Upgrade to premium to export professional PDF reports.",
        });
        return;
      }
      exportToPDF(transactions);
      toast.success("PDF Report generated!");
    },
    isPremium: !!user?.is_premium,
    hasMore,
    loadMore,
    loadingMore,
    user,
  };
}
