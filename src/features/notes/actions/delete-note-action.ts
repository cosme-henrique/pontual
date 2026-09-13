"use server";

import { revalidatePath } from "next/cache";
import { deleteNote } from "../use-cases/delete-note";
import { makeNoteRepository } from "../repositories/make-note-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function deleteNoteAction(id: string, projectId: string): Promise<ActionResult> {
  const repository = makeNoteRepository();
  await deleteNote(repository, id);

  revalidatePath(`/projetos/${projectId}`);
  return { success: true };
}
