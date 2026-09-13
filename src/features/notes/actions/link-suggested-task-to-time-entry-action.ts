"use server";

import { revalidatePath } from "next/cache";
import { makeNoteRepository } from "../repositories/make-note-repository";
import { linkSuggestedTaskToTimeEntry } from "../use-cases/link-suggested-task-to-time-entry";
import type { Note } from "../types";

type ActionResult =
  | { success: true; note: Note }
  | { success: false; error: string };

export async function linkSuggestedTaskToTimeEntryAction(
  noteId: string,
  suggestedTaskId: string,
  timeEntryId: string,
  projectId: string,
): Promise<ActionResult> {
  const repository = makeNoteRepository();

  try {
    const note = await linkSuggestedTaskToTimeEntry(repository, { noteId, suggestedTaskId, timeEntryId });
    revalidatePath(`/projetos/${projectId}`);
    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível vincular o lançamento à tarefa sugerida.",
    };
  }
}
