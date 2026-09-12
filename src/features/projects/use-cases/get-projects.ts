import type { IProjectRepository } from "../repositories/IProjectRepository";

export function getProjects(repository: IProjectRepository) {
  return repository.findMany();
}
