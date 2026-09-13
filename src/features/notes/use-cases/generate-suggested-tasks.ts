import type { IAiProvider } from "@/shared/services/ai/IAiProvider";
import type { INoteRepository } from "../repositories/INoteRepository";
import { suggestedTasksResponseSchema } from "../schemas/note-suggested-tasks-schema";
import type { Note } from "../types";

function listOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : fallback;
}

export async function generateSuggestedTasks(
  repository: INoteRepository,
  aiProvider: IAiProvider,
  noteId: string,
): Promise<Note> {
  const note = await repository.findById(noteId);
  if (!note) throw new Error("Anotação não encontrada");

  const understanding = note.aiUnderstanding;
  if (!understanding) throw new Error("Gere o entendimento da anotação antes de dividir em tarefas");

  const hasLinkedTask = note.aiSuggestedTasks?.some((task) => task.timeEntryId) ?? false;
  if (hasLinkedTask) {
    throw new Error("Existem tarefas que já foram transformadas em lançamentos. A lista não pode ser regenerada neste momento.");
  }

  const system = `Você decompõe o entendimento de uma tarefa em blocos de trabalho executáveis por um desenvolvedor.

Utilize SOMENTE as informações do entendimento abaixo (objetivo, pontos identificados, dependências e pontos para confirmar). Não invente requisitos, endpoints, regras de negócio, campos, telas ou tecnologias que não estejam presentes nele.

Pense em "quais blocos de trabalho um desenvolvedor poderia pegar e executar separadamente?" — nunca em "quais informações individuais aparecem no entendimento?". Não transforme cada requisito, dúvida ou campo em uma tarefa individual: agrupe itens relacionados em blocos de trabalho coesos (ex: campos de um mesmo formulário formam uma única tarefa de implementação, em vez de uma tarefa por campo).

Pontos para confirmar relacionados devem ser agrupados em uma única tarefa de validação/levantamento, em vez de uma tarefa por dúvida — nunca faça 1 dúvida = 1 tarefa. Dependências seguem a mesma lógica: só viram uma tarefa isolada quando representarem uma etapa realmente independente (ex: "mapear e validar os novos endpoints"); caso contrário, incorpore a informação na tarefa de implementação ou integração correspondente.

Priorize tarefas de implementação sobre tarefas de confirmação — a lista não pode ser dominada por dúvidas. Ordem de prioridade ao decompor: (1) levantamentos realmente necessários antes de implementar, (2) estrutura principal da funcionalidade, (3) blocos de interface e regras relacionadas, (4) integrações, (5) validação final.

Evite tarefas genéricas demais (ex: "desenvolver a funcionalidade", "fazer integração completa") e evite tarefas excessivamente pequenas (ex: uma tarefa por campo de input). Cada tarefa deve representar uma unidade prática de trabalho: escopo menor que a funcionalidade inteira, objetivo claro, executável isoladamente quando possível.

Gere entre 2 e 8 tarefas, usando agrupamento inteligente para caber nesse limite — não force uma lista maior. Se a tarefa original for muito simples, não force a criação de etapas desnecessárias.

Responda APENAS com um JSON no formato exato abaixo, sem nenhum texto adicional:
{
  "tasks": [
    { "title": "descrição curta e clara do bloco de trabalho" }
  ]
}`;

  const prompt = `Título: ${note.title}

Objetivo: ${understanding.objective ?? "Não identificado"}

Pontos identificados:
${listOrFallback(understanding.identifiedPoints, "Nenhum")}

Dependências:
${listOrFallback(understanding.dependencies, "Nenhuma")}

Pontos para confirmar:
${listOrFallback(understanding.questions, "Nenhum")}`;

  const raw = await aiProvider.generateText({ system, prompt, jsonMode: true });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é um JSON válido");
  }

  const parsed = suggestedTasksResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Não foi possível interpretar as tarefas sugeridas");
  }

  const tasks = parsed.data.tasks.map((task) => ({
    id: crypto.randomUUID(),
    title: task.title,
    timeEntryId: null,
  }));

  return repository.saveSuggestedTasks(noteId, tasks);
}
