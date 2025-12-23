"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactions } from "./_hooks/useTransactions";
import { TransactionHeader } from "./_components/TransactionHeader";
import { TransactionStats } from "./_components/TransactionStats";
import { TransactionSearch } from "./_components/TransactionSearch";
import { TransactionListMobile } from "./_components/TransactionListMobile";
import { TransactionTableDesktop } from "./_components/TransactionTableDesktop";
import { TransactionFilters } from "./_components/TransactionFilters";
import { EditModal } from "./_components/EditModal";
import { DeleteConfirmModal } from "./_components/DeleteConfirmModal";

export default function TransactionsPage() {
  const {
    filtered,
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    dateRange,
    setDateRange,
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
    handleExportPDF,
    isPremium,
  } = useTransactions();

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-6 pt-4 px-2 overflow-hidden">
      <TransactionHeader
        onExportExcel={exportToExcel}
        onExportPDF={handleExportPDF}
        isPremium={isPremium}
      />

      <TransactionStats income={stats.income} expense={stats.expense} />

      <Card className="flex-1 flex flex-col min-h-0 border bg-card shadow-sm gap-3">
        <TransactionSearch value={search} onChange={setSearch} />
        <TransactionFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          dateRange={dateRange}
          setDateRange={setDateRange}
          categories={categories}
        />

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
              <TransactionListMobile
                transactions={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <TransactionTableDesktop
                transactions={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </ScrollArea>
      </Card>

      <EditModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onUpdate={handleUpdate}
        onChange={setEditingTransaction}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
