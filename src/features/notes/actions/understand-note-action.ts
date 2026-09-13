"use server";

import { revalidatePath } from "next/cache";
import { makeAiProvider } from "@/shared/services/ai/make-ai-provider";
import { makeNoteRepository } from "../repositories/make-note-repository";
import { understandNote } from "../use-cases/understand-note";
import type { Note } from "../types";

type ActionResult =
  | { success: true; note: Note }
  | { success: false; error: string };

export async function understandNoteAction(noteId: string, projectId: string): Promise<ActionResult> {
  const repository = makeNoteRepository();
  const aiProvider = makeAiProvider();

  try {
    const note = await understandNote(repository, aiProvider, noteId);
    revalidatePath(`/projetos/${projectId}`);
    return { success: true, note };
  } catch {
    return { success: false, error: "Não foi possível analisar a anotação. Tente novamente." };
  }
}
