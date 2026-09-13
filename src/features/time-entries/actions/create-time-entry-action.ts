"use server";

import { revalidatePath } from "next/cache";
import { createTimeEntrySchema } from "../schemas/create-time-entry-schema";
import { createTimeEntry } from "../use-cases/create-time-entry";
import { makeTimeEntryRepository } from "../repositories/make-time-entry-repository";
import type { TimeEntry } from "../types";

type ActionResult =
  | { success: true; entry: TimeEntry }
  | { success: false; error: string };

export async function createTimeEntryAction(
  formData: Record<string, unknown>,
): Promise<ActionResult> {
  const coerced = {
    ...formData,
    hours: Number(formData.hours),
    minutes: Number(formData.minutes),
  };

  const parsed = createTimeEntrySchema.safeParse(coerced);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const repository = makeTimeEntryRepository();
  const entry = await createTimeEntry(repository, parsed.data);

  revalidatePath("/dashboard");
  return { success: true, entry };
}
