"use server";

import { revalidatePath } from "next/cache";
import { noteSchema } from "../schemas/note-schema";
import { createNote } from "../use-cases/create-note";
import { makeNoteRepository } from "../repositories/make-note-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function createNoteAction(
  formData: Record<string, unknown>,
): Promise<ActionResult> {
  const parsed = noteSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const repository = makeNoteRepository();
  await createNote(repository, parsed.data);

  revalidatePath(`/projetos/${parsed.data.projectId}`);
  return { success: true };
}
