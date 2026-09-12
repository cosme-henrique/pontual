import { getCurrentMonth } from "@/shared/lib/date";
import type { IMonthFilterRepository } from "../repositories/IMonthFilterRepository";

export async function getSelectedMonth(repository: IMonthFilterRepository): Promise<string> {
  const selectedMonth = await repository.get();
  return selectedMonth ?? getCurrentMonth();
}
