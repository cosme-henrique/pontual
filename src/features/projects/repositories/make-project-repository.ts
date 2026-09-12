import type { IProjectRepository } from "./IProjectRepository";
import { SupabaseProjectRepository } from "./supabase-project-repository";

export function makeProjectRepository(): IProjectRepository {
  return new SupabaseProjectRepository();
}
