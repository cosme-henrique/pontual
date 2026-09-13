import type { INoteRepository } from "../repositories/INoteRepository";

export function deleteNote(repository: INoteRepository, id: string) {
  return repository.remove(id);
}
