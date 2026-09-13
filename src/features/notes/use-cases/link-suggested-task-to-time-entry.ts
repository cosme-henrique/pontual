import type { INoteRepository } from "../repositories/INoteRepository";

export function linkSuggestedTaskToTimeEntry(
  repository: INoteRepository,
  input: { noteId: string; suggestedTaskId: string; timeEntryId: string },
) {
  return repository.linkSuggestedTaskToTimeEntry(input.noteId, input.suggestedTaskId, input.timeEntryId);
}
