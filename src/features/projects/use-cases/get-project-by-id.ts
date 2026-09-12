import type { IProjectRepository } from "../repositories/IProjectRepository";

export function getProjectById(repository: IProjectRepository, id: string) {
  return repository.findById(id);
}
