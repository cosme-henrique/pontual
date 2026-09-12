import type { IMonthlyRateRepository } from "../repositories/IMonthlyRateRepository";
import type { MonthlyRate } from "../types";

export async function setMonthlyRate(
  repository: IMonthlyRateRepository,
  month: string,
  hourlyRate: number,
): Promise<MonthlyRate> {
  return repository.upsert(month, hourlyRate);
}
