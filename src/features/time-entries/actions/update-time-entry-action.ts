"use server";

import { revalidatePath } from "next/cache";
import { createTimeEntrySchema } from "../schemas/create-time-entry-schema";
import { updateTimeEntry } from "../use-cases/update-time-entry";
import { makeTimeEntryRepository } from "../repositories/make-time-entry-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateTimeEntryAction(
  id: string,
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
  await updateTimeEntry(repository, id, parsed.data);

  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
  return { success: true };
}
