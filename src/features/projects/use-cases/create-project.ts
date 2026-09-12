import type { IProjectRepository } from "../repositories/IProjectRepository";
import type { ProjectInput } from "../schemas/project-schema";

export function createProject(repository: IProjectRepository, input: ProjectInput) {
  return repository.create(input);
}
