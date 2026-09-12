"use server";

import { makeMonthFilterRepository } from "@/features/month-filter/repositories/make-month-filter-repository";
import { setSelectedMonth } from "@/features/month-filter/use-cases/set-selected-month";

export async function setSelectedMonthAction(month: string): Promise<void> {
  const repository = makeMonthFilterRepository();
  await setSelectedMonth(repository, month);
}
