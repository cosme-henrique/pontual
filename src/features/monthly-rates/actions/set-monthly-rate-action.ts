"use server";

import { revalidatePath } from "next/cache";
import { setMonthlyRateSchema } from "../schemas/set-monthly-rate-schema";
import { setMonthlyRate } from "../use-cases/set-monthly-rate";
import { makeMonthlyRateRepository } from "../repositories/make-monthly-rate-repository";

export async function setMonthlyRateAction(month: string, hourlyRate: number): Promise<void> {
  const parsed = setMonthlyRateSchema.parse({ month, hourlyRate });

  const repository = makeMonthlyRateRepository();
  await setMonthlyRate(repository, parsed.month, parsed.hourlyRate);

  revalidatePath("/", "layout");
}
