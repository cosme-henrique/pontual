import type { INoteRepository } from "../repositories/INoteRepository";
import type { UpdateNoteInput } from "../schemas/note-schema";

export function updateNote(repository: INoteRepository, id: string, input: UpdateNoteInput) {
  return repository.update(id, input);
}
