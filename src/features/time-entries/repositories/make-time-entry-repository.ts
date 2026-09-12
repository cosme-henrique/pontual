import type { ITimeEntryRepository } from "./ITimeEntryRepository";
import { SupabaseTimeEntryRepository } from "./supabase-time-entry-repository";

export function makeTimeEntryRepository(): ITimeEntryRepository {
  return new SupabaseTimeEntryRepository();
}
