"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactions } from "./_hooks/useTransactions";
import { TransactionHeader } from "./_components/TransactionHeader";
import { TransactionStats } from "./_components/TransactionStats";
import { TransactionSearch } from "./_components/TransactionSearch";
import { TransactionFilters } from "./_components/TransactionFilters";
import { TransactionListMobile } from "./_components/TransactionListMobile";
import { TransactionTableDesktop } from "./_components/TransactionTableDesktop";
import { TransactionCards } from "./_components/TransactionCards";
import { TransactionAnalysis } from "./_components/TransactionAnalysis";
import { EditModal } from "./_components/EditModal";
import { AddTransactionModal } from "./_components/AddTransactionModal";
import { DeleteConfirmModal } from "./_components/DeleteConfirmModal";
import { useLanguage } from "@/context/LanguageContext";
import { List, LayoutGrid, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionTab = "list" | "cards" | "analysis";

const TABS: { id: TransactionTab; label: string; icon: typeof List }[] = [
  { id: "list", label: "Transaksi", icon: List },
  { id: "cards", label: "Card Transaksi", icon: LayoutGrid },
  { id: "analysis", label: "Analisis", icon: BarChart3 },
];

export default function TransactionsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TransactionTab>("list");
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
    sortBy,
    setSortBy,
    categories,
    isAddOpen,
    newTransaction,
    setNewTransaction,
    openAdd,
    closeAdd,
    handleCreate,
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
    hasMore,
    loadMore,
    loadingMore,
    user,
  } = useTransactions();

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-6 pt-6 px-2 overflow-hidden">
      <TransactionHeader
        onExportExcel={exportToExcel}
        onExportPDF={handleExportPDF}
        isPremium={isPremium}
      />

      <TransactionStats income={stats.income} expense={stats.expense} />

      <Card className="flex-1 flex flex-col min-h-0 border bg-card shadow-sm gap-3">
        <div className="flex border-b px-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <TransactionSearch value={search} onChange={setSearch} />
        <TransactionFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          dateRange={dateRange}
          setDateRange={setDateRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          billingCycleStartDay={user?.billing_cycle_start_day || 1}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "list" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {t.common.loading}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {t.history.no_transactions}
                </div>
              ) : (
                <div className="pb-4">
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
                  {hasMore && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full max-w-xs"
                      >
                        {loadingMore ? t.history.loading : t.history.load_more}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "cards" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {t.common.loading}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {t.history.no_transactions}
                </div>
              ) : (
                <div className="pb-4">
                  <TransactionCards
                    transactions={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  {hasMore && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full max-w-xs"
                      >
                        {loadingMore ? t.history.loading : t.history.load_more}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "analysis" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  {t.common.loading}
                </div>
              ) : (
                <div className="pb-4">
                  <TransactionAnalysis transactions={filtered} />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <Button
        type="button"
        size="icon"
        onClick={openAdd}
        aria-label={t.history.add_transaction}
        className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg sm:bottom-8"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddTransactionModal
        isOpen={isAddOpen}
        form={newTransaction}
        onClose={closeAdd}
        onSubmit={handleCreate}
        onChange={setNewTransaction}
      />

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
