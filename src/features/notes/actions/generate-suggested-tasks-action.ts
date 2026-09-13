"use server";

import { revalidatePath } from "next/cache";
import { makeAiProvider } from "@/shared/services/ai/make-ai-provider";
import { makeNoteRepository } from "../repositories/make-note-repository";
import { generateSuggestedTasks } from "../use-cases/generate-suggested-tasks";
import type { Note } from "../types";

type ActionResult =
  | { success: true; note: Note }
  | { success: false; error: string };

export async function generateSuggestedTasksAction(noteId: string, projectId: string): Promise<ActionResult> {
  const repository = makeNoteRepository();
  const aiProvider = makeAiProvider();

  try {
    const note = await generateSuggestedTasks(repository, aiProvider, noteId);
    revalidatePath(`/projetos/${projectId}`);
    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível dividir em tarefas. Tente novamente.",
    };
  }
}
