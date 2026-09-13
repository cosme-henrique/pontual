"use server";

import { revalidatePath } from "next/cache";
import { updateNoteSchema } from "../schemas/note-schema";
import { updateNote } from "../use-cases/update-note";
import { makeNoteRepository } from "../repositories/make-note-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateNoteAction(
  id: string,
  projectId: string,
  formData: Record<string, unknown>,
): Promise<ActionResult> {
  const parsed = updateNoteSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const repository = makeNoteRepository();
  await updateNote(repository, id, parsed.data);

  revalidatePath(`/projetos/${projectId}`);
  return { success: true };
}
