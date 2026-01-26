"use client";

import { format, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangeFilterProps {
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({
  filterType,
  onFilterTypeChange,
  customRange,
  onCustomRangeChange,
}: DateRangeFilterProps) {
  const handleCustomDateChange = (type: "from" | "to", value: string) => {
    // Append T00:00:00 to ensure local time interpretation if that's preferred,
    // or just rely on browser behavior. The key is to handle invalid dates.
    const date = value ? new Date(value) : undefined;
    onCustomRangeChange({ ...customRange, [type]: date });
  };

  const formatDateSafely = (date: Date | undefined) => {
    if (!date || !isValid(date)) return "";
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-muted/50 p-2 rounded-lg">
      <div className="flex items-center gap-2">
        <Label htmlFor="filterType" className="whitespace-nowrap">
          Filter By:
        </Label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="last30Days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {filterType === "custom" && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-5 duration-300">
          <Input
            type="date"
            className="w-[150px]"
            value={formatDateSafely(customRange.from)}
            onChange={(e) => handleCustomDateChange("from", e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            className="w-[150px]"
            value={formatDateSafely(customRange.to)}
            onChange={(e) => handleCustomDateChange("to", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
