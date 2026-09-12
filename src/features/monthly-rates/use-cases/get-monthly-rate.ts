import type { IMonthlyRateRepository } from "../repositories/IMonthlyRateRepository";
import type { MonthlyRate } from "../types";

export async function getMonthlyRate(
  repository: IMonthlyRateRepository,
  month: string,
): Promise<MonthlyRate | null> {
  return repository.findByMonth(month);
}
