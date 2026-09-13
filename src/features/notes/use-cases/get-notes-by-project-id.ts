import type { INoteRepository } from "../repositories/INoteRepository";

export function getNotesByProjectId(repository: INoteRepository, projectId: string) {
  return repository.findByProjectId(projectId);
}
