import type { IProjectRepository } from "../repositories/IProjectRepository";

export function getProjectStats(repository: IProjectRepository, projectId: string, month: string) {
  return repository.getStats(projectId, month);
}
