import { supabase } from "@/shared/lib/supabase";
import type { IMonthlyRateRepository } from "./IMonthlyRateRepository";
import type { MonthlyRate } from "../types";

type MonthlyRateRow = {
  month: string;
  hourly_rate: number;
};

function toMonthlyRate(row: MonthlyRateRow): MonthlyRate {
  return {
    month: row.month,
    hourlyRate: row.hourly_rate,
  };
}

export class SupabaseMonthlyRateRepository implements IMonthlyRateRepository {
  async findByMonth(month: string): Promise<MonthlyRate | null> {
    const { data, error } = await supabase
      .from("monthly_rates")
      .select("month, hourly_rate")
      .eq("month", month)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? toMonthlyRate(data as MonthlyRateRow) : null;
  }

  async upsert(month: string, hourlyRate: number): Promise<MonthlyRate> {
    const { data, error } = await supabase
      .from("monthly_rates")
      .upsert({ month, hourly_rate: hourlyRate }, { onConflict: "month" })
      .select("month, hourly_rate")
      .single();

    if (error) throw new Error(error.message);

    return toMonthlyRate(data as MonthlyRateRow);
  }
}
