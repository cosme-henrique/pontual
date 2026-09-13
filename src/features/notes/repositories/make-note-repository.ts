import type { INoteRepository } from "./INoteRepository";
import { SupabaseNoteRepository } from "./supabase-note-repository";

export function makeNoteRepository(): INoteRepository {
  return new SupabaseNoteRepository();
}
