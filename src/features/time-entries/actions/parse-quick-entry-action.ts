"use server";

import { makeAiProvider } from "@/shared/services/ai/make-ai-provider";
import { getToday } from "@/shared/lib/date";
import { makeTimeEntryRepository } from "../repositories/make-time-entry-repository";
import { getProjects } from "../use-cases/get-projects";
import { parseQuickEntry } from "../use-cases/parse-quick-entry";
import type { QuickEntryDraft } from "../schemas/quick-entry-draft-schema";

type ActionResult =
  | { success: true; draft: QuickEntryDraft }
  | { success: false; error: string };

export async function parseQuickEntryAction(text: string): Promise<ActionResult> {
  if (!text.trim()) {
    return { success: false, error: "Descreva o que foi feito" };
  }

  const repository = makeTimeEntryRepository();
  const projects = await getProjects(repository);
  const aiProvider = makeAiProvider();

  try {
    const draft = await parseQuickEntry(aiProvider, { text, projects, today: getToday() });
    return { success: true, draft };
  } catch {
    return { success: false, error: "Não foi possível interpretar o texto. Tente reescrever ou preencha manualmente." };
  }
}
