import { Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  filterType: "all" | "income" | "expense";
  setFilterType: (type: "all" | "income" | "expense") => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
  categories: string[];
}

export function TransactionFilters({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  dateRange,
  setDateRange,
  categories,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    filterType !== "all",
    filterCategory !== "all",
    dateRange.from !== "" || dateRange.to !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setDateRange({ from: "", to: "" });
  };

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
            <span>Filters</span>
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
              <X className="h-3 w-3" />
              Reset
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
              <div className="grid grid-cols-3 gap-4 py-4 border-t mt-4">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(["all", "income", "expense"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all capitalize border",
                          filterType === type
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted/50 border-transparent hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-transparent bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date Range
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1 min-w-0">
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, from: e.target.value })
                        }
                        className="h-9 pl-8 pr-2 py-1 text-[10px] bg-muted/50 border-none rounded-lg w-full"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold shrink-0">
                      TO
                    </span>
                    <div className="relative flex-1 min-w-0">
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, to: e.target.value })
                        }
                        className="h-9 pl-8 pr-2 py-1 text-[10px] bg-muted/50 border-none rounded-lg w-full"
                      />
                    </div>
                  </div>
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
                  <h2 className="text-lg font-bold tracking-tight">Filters</h2>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-[11px] font-semibold text-primary hover:opacity-80 transition-opacity"
                      >
                        Reset All
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
                      Transaction Type
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
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      Category
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
                          {cat === "all" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      Date Range
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, from: e.target.value })
                          }
                          className="h-10 px-3 bg-muted/30 border-none rounded-xl text-xs"
                        />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground/40">
                        TO
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
                  </div>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 rounded-xl text-sm font-bold mt-2 shadow-lg shadow-primary/20"
                >
                  Apply Filters
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
