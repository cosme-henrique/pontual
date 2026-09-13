import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";

export function getTimeEntryById(repository: ITimeEntryRepository, id: string) {
  return repository.findById(id);
}
