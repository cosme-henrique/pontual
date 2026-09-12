import type { IMonthFilterRepository } from "../repositories/IMonthFilterRepository";

const MONTH_FORMAT = /^\d{4}-\d{2}$/;

export async function setSelectedMonth(repository: IMonthFilterRepository, month: string): Promise<void> {
  if (!MONTH_FORMAT.test(month)) {
    throw new Error(`Invalid month format: "${month}"`);
  }

  await repository.set(month);
}
