import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";

export function deleteTimeEntry(repository: ITimeEntryRepository, id: string) {
  return repository.remove(id);
}
