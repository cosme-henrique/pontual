import type { INoteRepository } from "../repositories/INoteRepository";
import type { NoteInput } from "../schemas/note-schema";

export function createNote(repository: INoteRepository, input: NoteInput) {
  return repository.create(input);
}
