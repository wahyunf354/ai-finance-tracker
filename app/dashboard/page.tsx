"use client";

import { useDashboardData } from "./_hooks/useDashboardData";
import { DashboardHeader } from "./_components/DashboardHeader";
import { QuickStats } from "./_components/QuickStats";
import { SpendingActivity } from "./_components/SpendingActivity";
import { CategoryDistribution } from "./_components/CategoryDistribution";
import { TopExpenses } from "./_components/TopExpenses";
import { FinancialInsights } from "./_components/FinancialInsights";

export default function DashboardPage() {
  const { loading, stats, categoryData, chartData, topExpenses } =
    useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6 pt-2 pb-24 overflow-y-auto px-4 custom-scrollbar">
      <DashboardHeader
        title="Financial Dashboard"
        subtitle="Monitor your spending behavior"
      />

      <QuickStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingActivity data={chartData} />
        <CategoryDistribution categoryData={categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopExpenses topExpenses={topExpenses} />
        <FinancialInsights savingsRate={stats.savingsRate} />
      </div>
    </div>
  );
}
