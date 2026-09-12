import type { MonthlyRate } from "../types";

export interface IMonthlyRateRepository {
  findByMonth(month: string): Promise<MonthlyRate | null>;
  upsert(month: string, hourlyRate: number): Promise<MonthlyRate>;
}
