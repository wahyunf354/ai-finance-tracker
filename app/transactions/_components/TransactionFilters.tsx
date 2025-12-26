import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface TransactionFiltersProps {
  filterType: "all" | "income" | "expense";
  setFilterType: (type: "all" | "income" | "expense") => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
  setSortBy: (sort: "newest" | "oldest" | "highest" | "lowest") => void;
  categories: string[];
  billingCycleStartDay: number;
}

export function TransactionFilters({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  categories,
  billingCycleStartDay,
}: TransactionFiltersProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Month Filter State
  const [viewMode, setViewMode] = useState<"monthly" | "custom">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate Date Range based on cycle day
  const calculateDateRange = (
    month: number,
    year: number,
    startDay: number
  ) => {
    // Logic:
    // If startDay is 1: Month is 1st to Last Day of Month.
    // If startDay > 1: Month is StartDay of PrevMonth to (StartDay - 1) of CurrentMonth ?
    // OR StartDay of CurrentMonth to (StartDay - 1) of NextMonth?
    // User said "1 month rotation". Usually "January Budget" means starting in Jan.
    // Let's assume: Period starting in Selected Month.
    // Example: Selected Jan 2025, Cycle 25. Range: Jan 25, 2025 - Feb 24, 2025.

    // Actually, usually if I say "Expenses for Jan", and my cycle is 25th.
    // Does it map to Dec 25-Jan 24 or Jan 25-Feb 24?
    // Let's assume start date provided matches the month.

    let fromDate: Date;
    let toDate: Date;

    if (startDay === 1) {
      fromDate = new Date(year, month, 1);
      toDate = new Date(year, month + 1, 0);
    } else {
      // Option: Period starting in this month
      fromDate = new Date(year, month, startDay);
      toDate = new Date(year, month + 1, startDay - 1);
    }

    // Format YYYY-MM-DD
    const isoFrom = fromDate.toISOString().split("T")[0];
    const isoTo = toDate.toISOString().split("T")[0];
    return { from: isoFrom, to: isoTo };
  };

  // Effect to update date range when monthly params change
  useEffect(() => {
    if (viewMode === "monthly") {
      const range = calculateDateRange(
        selectedMonth,
        selectedYear,
        billingCycleStartDay
      );
      // Only update if different to avoid loop (though setDateRange usually checks equality if primitive, object might trigger)
      // We should check values.
      if (range.from !== dateRange.from || range.to !== dateRange.to) {
        setDateRange(range);
      }
    }
  }, [viewMode, selectedMonth, selectedYear, billingCycleStartDay]);

  const activeFiltersCount = [
    filterType !== "all",
    filterCategory !== "all",
    (viewMode === "custom" && (dateRange.from !== "" || dateRange.to !== "")) ||
      (viewMode === "monthly" &&
        (selectedMonth !== new Date().getMonth() ||
          selectedYear !== new Date().getFullYear())),
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setSortBy("newest");
    setViewMode("monthly");
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
    // Effect will trigger setDateRange
  };

  const getTypeLabel = (type: string) => {
    if (type === "all") return t.history.filter_all;
    if (type === "income") return t.history.filter_income;
    if (type === "expense") return t.history.filter_expense;
    return type;
  };

  const getSortLabel = (sort: string) => {
    if (sort === "newest") return t.history.sort_newest;
    if (sort === "oldest") return t.history.sort_oldest;
    if (sort === "highest") return t.history.sort_highest;
    if (sort === "lowest") return t.history.sort_lowest;
    return sort;
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    return new Date(0, i).toLocaleString(language, { month: "long" });
  });

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  return (
    <>
      {/* Desktop Filter Row */}
      <div className="hidden md:block px-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "gap-2 h-9 rounded-xl border-dashed",
              isOpen && "bg-muted"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>{t.history.filters}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground min-w-[18px]">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5" />
              {t.history.reset}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 border-t mt-4">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.history.type}
                  </label>
                  <div className="flex gap-2">
                    {(["all", "income", "expense"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={cn(
                          "flex-1 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-all capitalize border",
                          filterType === type
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted/50 border-transparent hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {getTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.history.category}
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-transparent bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? t.history.filter_all : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.history.date_range}
                    </label>
                    <button
                      onClick={() =>
                        setViewMode(
                          viewMode === "monthly" ? "custom" : "monthly"
                        )
                      }
                      className="text-[10px] text-primary hover:underline font-medium whitespace-nowrap"
                    >
                      {viewMode === "monthly"
                        ? t.history.custom_range
                        : t.history.month_view}
                    </button>
                  </div>

                  {viewMode === "monthly" ? (
                    <div className="flex gap-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) =>
                          setSelectedMonth(parseInt(e.target.value))
                        }
                        className="flex-1 h-9 px-2 rounded-lg border border-transparent bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(parseInt(e.target.value))
                        }
                        className="w-20 h-9 px-2 rounded-lg border border-transparent bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1 min-w-0">
                        <Input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, from: e.target.value })
                          }
                          className="h-9 px-2 py-1 text-[10px] bg-muted/50 border-none rounded-lg w-full"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold shrink-0">
                        {t.history.to}
                      </span>
                      <div className="relative flex-1 min-w-0">
                        <Input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, to: e.target.value })
                          }
                          className="h-9 px-2 py-1 text-[10px] bg-muted/50 border-none rounded-lg w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.history.sort_by}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "newest"
                          | "oldest"
                          | "highest"
                          | "lowest"
                      )
                    }
                    className="w-full h-9 px-3 rounded-lg border border-transparent bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="newest">{t.history.sort_newest}</option>
                    <option value="oldest">{t.history.sort_oldest}</option>
                    <option value="highest">{t.history.sort_highest}</option>
                    <option value="lowest">{t.history.sort_lowest}</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-transform flex items-center justify-center p-0"
        >
          <div className="relative">
            <Filter className="h-6 w-6" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </Button>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg bg-card border-t shadow-2xl rounded-t-[32px] overflow-hidden flex flex-col p-6 pb-12 gap-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold tracking-tight">
                    {t.history.filters}
                  </h2>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-[11px] font-semibold text-primary hover:opacity-80 transition-opacity"
                      >
                        {t.history.reset_all}
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full h-7 w-7 bg-muted/50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      {t.history.type}
                    </label>
                    <div className="flex gap-1.5">
                      {(["all", "income", "expense"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilterType(type)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all capitalize border",
                            filterType === type
                              ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                              : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {getTypeLabel(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      {t.history.category}
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={cn(
                            "py-2 px-3.5 rounded-xl text-[11px] font-medium transition-all capitalize border",
                            filterCategory === cat
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {cat === "all" ? t.history.filter_all : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                        {t.history.date_range}
                      </label>
                      <button
                        onClick={() =>
                          setViewMode(
                            viewMode === "monthly" ? "custom" : "monthly"
                          )
                        }
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        {viewMode === "monthly"
                          ? t.history.custom_range
                          : t.history.month_view}
                      </button>
                    </div>

                    {viewMode === "monthly" ? (
                      <div className="flex gap-2">
                        <select
                          value={selectedMonth}
                          onChange={(e) =>
                            setSelectedMonth(parseInt(e.target.value))
                          }
                          className="flex-1 h-10 px-3 rounded-xl border border-transparent bg-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {months.map((m, i) => (
                            <option key={i} value={i}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedYear}
                          onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                          }
                          className="w-24 h-10 px-3 rounded-xl border border-transparent bg-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                from: e.target.value,
                              })
                            }
                            className="h-10 px-3 bg-muted/30 border-none rounded-xl text-xs"
                          />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40">
                          {t.history.to}
                        </span>
                        <div className="relative flex-1">
                          <Input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) =>
                              setDateRange({ ...dateRange, to: e.target.value })
                            }
                            className="h-10 px-3 bg-muted/30 border-none rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      {t.history.sort_by}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["newest", "oldest", "highest", "lowest"] as const).map(
                        (sort) => (
                          <button
                            key={sort}
                            onClick={() => setSortBy(sort)}
                            className={cn(
                              "py-2.5 rounded-xl text-xs font-medium transition-all capitalize border",
                              sortBy === sort
                                ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                                : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                            )}
                          >
                            {getSortLabel(sort)}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 rounded-xl text-sm font-bold mt-2 shadow-lg shadow-primary/20"
                >
                  {t.history.apply}
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
