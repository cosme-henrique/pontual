"use client";

import { useState } from "react";
import { Input } from "@/shared/ui";
import { setMonthlyRateAction } from "../actions/set-monthly-rate-action";

type MonthlyRateInputProps = {
  selectedMonth: string;
  initialRate: number | null;
};

export function MonthlyRateInput({ selectedMonth, initialRate }: MonthlyRateInputProps) {
  const [value, setValue] = useState(initialRate !== null ? String(initialRate) : "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleBlur() {
    const parsedRate = Number(value);
    if (value === "" || Number.isNaN(parsedRate) || parsedRate < 0) return;

    setIsSaving(true);
    await setMonthlyRateAction(selectedMonth, parsedRate);
    setIsSaving(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="sidebar-monthly-rate"
        className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-400"
      >
        Valor/hora (R$)
      </label>
      <Input
        id="sidebar-monthly-rate"
        type="number"
        min={0}
        step="0.01"
        placeholder="0,00"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleBlur}
        disabled={isSaving}
      />
    </div>
  );
}
