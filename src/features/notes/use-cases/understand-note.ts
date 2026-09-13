import type { IAiProvider } from "@/shared/services/ai/IAiProvider";
import type { INoteRepository } from "../repositories/INoteRepository";
import { noteUnderstandingSchema } from "../schemas/note-understanding-schema";
import type { Note } from "../types";

export async function understandNote(
  repository: INoteRepository,
  aiProvider: IAiProvider,
  noteId: string,
): Promise<Note> {
  const note = await repository.findById(noteId);
  if (!note) throw new Error("Anotação não encontrada");

  const system = `Você analisa anotações feitas por um profissional durante uma reunião ou explicação de tarefa.

Utilize SOMENTE as informações presentes no título e conteúdo da anotação abaixo. Não complete requisitos usando conhecimento próprio, não invente endpoints, regras de negócio, campos, comportamentos ou tecnologias.

Se uma informação for incerta, ambígua ou não estiver explícita na anotação, coloque-a em "questions" (pontos para confirmar) em vez de presumir uma resposta.

Responda APENAS com um JSON no formato exato abaixo, sem nenhum texto adicional:
{
  "objective": "objetivo principal identificado na anotação, em uma frase, ou null se não for possível identificar",
  "identifiedPoints": ["requisitos ou informações claramente mencionadas na anotação"],
  "dependencies": ["dependências explicitamente mencionadas na anotação"],
  "questions": ["pontos ambíguos ou informações que precisam ser confirmadas"]
}`;

  const prompt = `Título: ${note.title}\n\nConteúdo:\n${note.content}`;

  const raw = await aiProvider.generateText({ system, prompt, jsonMode: true });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é um JSON válido");
  }

  const parsed = noteUnderstandingSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Não foi possível interpretar a análise da anotação");
  }

  return repository.saveUnderstanding(noteId, parsed.data);
}
