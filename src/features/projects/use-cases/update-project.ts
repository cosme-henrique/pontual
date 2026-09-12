import type { IProjectRepository } from "../repositories/IProjectRepository";
import type { ProjectInput } from "../schemas/project-schema";

export function updateProject(repository: IProjectRepository, id: string, input: ProjectInput) {
  return repository.update(id, input);
}
