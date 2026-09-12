import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";

export function getProjects(repository: ITimeEntryRepository) {
  return repository.getProjects();
}
