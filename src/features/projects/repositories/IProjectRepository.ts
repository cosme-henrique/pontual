import type { Project, ProjectStats } from "../types";

export interface IProjectRepository {
  findMany(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  getStats(projectId: string, month: string): Promise<ProjectStats>;
  create(input: { name: string; clientName?: string }): Promise<Project>;
  update(id: string, input: { name: string; clientName?: string }): Promise<Project>;
  remove(id: string): Promise<void>;
}
