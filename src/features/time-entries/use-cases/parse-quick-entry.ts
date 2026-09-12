import type { IAiProvider } from "@/shared/services/ai/IAiProvider";
import type { Project } from "../types";
import { quickEntryDraftSchema, type QuickEntryDraft } from "../schemas/quick-entry-draft-schema";

type Input = {
  text: string;
  projects: Project[];
  today: string;
};

export async function parseQuickEntry(aiProvider: IAiProvider, input: Input): Promise<QuickEntryDraft> {
  const projectsList = input.projects
    .map((project) => `${project.id}: ${project.name}${project.clientName ? ` (${project.clientName})` : ""}`)
    .join("\n");

  const system = `Você extrai lançamentos de horas de trabalho a partir de texto livre em português.
Data de hoje: ${input.today}.

Projetos disponíveis (use o id exato de um deles, ou null se nenhum corresponder ao texto):
${projectsList}

Responda APENAS com um JSON no formato exato abaixo, sem nenhum texto adicional:
{
  "projectId": "id do projeto ou null",
  "task": "descrição curta e clara da tarefa",
  "date": "data no formato YYYY-MM-DD, ou null se não houver data",
  "durationMinutes": número inteiro de minutos (se não houver duração explícita, estime um valor razoável),
  "status": "backlog" | "pending" | "done"
}`;

  const raw = await aiProvider.generateText({ system, prompt: input.text, jsonMode: true });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é um JSON válido");
  }

  const parsed = quickEntryDraftSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Não foi possível interpretar o texto");
  }

  return parsed.data;
}
