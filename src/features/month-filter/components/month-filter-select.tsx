"use client";

import { startTransition } from "react";
import { Select } from "@/shared/ui/select";
import { getRecentMonths } from "@/shared/lib/date";
import { formatMonthLabel } from "@/shared/lib/format";
import { setSelectedMonthAction } from "../actions/set-selected-month-action";

type MonthFilterSelectProps = {
  selectedMonth: string;
};

const MONTH_OPTIONS = getRecentMonths(12).map((month) => ({
  value: month,
  label: formatMonthLabel(month),
}));

export function MonthFilterSelect({ selectedMonth }: MonthFilterSelectProps) {
  function handleChange(month: string) {
    startTransition(async () => {
      await setSelectedMonthAction(month);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="sidebar-month-filter"
        className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-400"
      >
        Mês
      </label>
      <Select
        id="sidebar-month-filter"
        options={MONTH_OPTIONS}
        value={selectedMonth}
        onChange={handleChange}
      />
    </div>
  );
}
