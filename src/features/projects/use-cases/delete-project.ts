import type { IProjectRepository } from "../repositories/IProjectRepository";

export function deleteProject(repository: IProjectRepository, id: string) {
  return repository.remove(id);
}
