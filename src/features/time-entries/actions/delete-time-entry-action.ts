"use server";

import { revalidatePath } from "next/cache";
import { deleteTimeEntry } from "../use-cases/delete-time-entry";
import { makeTimeEntryRepository } from "../repositories/make-time-entry-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function deleteTimeEntryAction(id: string): Promise<ActionResult> {
  try {
    const repository = makeTimeEntryRepository();
    await deleteTimeEntry(repository, id);

    revalidatePath("/dashboard");
    revalidatePath("/lancamentos");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao deletar lançamento" };
  }
}
