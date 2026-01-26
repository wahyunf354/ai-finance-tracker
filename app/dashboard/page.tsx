"use client";

import { useState } from "react";
import { useDashboardData, DateRange } from "./_hooks/useDashboardData";
import { DashboardHeader } from "./_components/DashboardHeader";
import { QuickStats } from "./_components/QuickStats";
import { SpendingActivity } from "./_components/SpendingActivity";
import { CategoryDistribution } from "./_components/CategoryDistribution";
import { TopExpenses } from "./_components/TopExpenses";
import { FinancialInsights } from "./_components/FinancialInsights";
import { DateRangeFilter } from "./_components/DateRangeFilter";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  subDays,
} from "date-fns";

export default function DashboardPage() {
  const [filterType, setFilterType] = useState("thisMonth");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    const today = new Date();
    switch (type) {
      case "thisMonth":
        setAppliedDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        setAppliedDateRange({
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        });
        break;
      case "thisYear":
        setAppliedDateRange({
          from: startOfYear(today),
          to: endOfMonth(today),
        });
        break;
      case "last30Days":
        setAppliedDateRange({ from: subDays(today, 30), to: today });
        break;
      case "custom":
        // If switching to custom, only apply if we already have a valid range
        if (customRange.from && customRange.to) {
          setAppliedDateRange(customRange);
        }
        break;
    }
  };

  const handleCustomRangeChange = (range: DateRange) => {
    setCustomRange(range);
    if (filterType === "custom" && range.from && range.to) {
      setAppliedDateRange(range);
    }
  };

  const { transactions, loading, stats, categoryData, chartData, topExpenses } =
    useDashboardData(appliedDateRange);

  const showInitialLoading = loading && transactions.length === 0;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6 pt-2 pb-24 overflow-y-auto px-4 custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeader
          title="Financial Dashboard"
          subtitle="Monitor your spending behavior"
        />
        <DateRangeFilter
          filterType={filterType}
          onFilterTypeChange={handleFilterTypeChange}
          customRange={customRange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </div>

      {showInitialLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      ) : (
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            loading ? "pointer-events-none opacity-50" : ""
          }`}
        >
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
      )}
    </div>
  );
}
