import { supabase } from "@/shared/lib/supabase";
import type { INoteRepository } from "./INoteRepository";
import type { Note } from "../types";
import type { NoteUnderstanding } from "../schemas/note-understanding-schema";
import type { SuggestedTask } from "../schemas/note-suggested-tasks-schema";

const NOTE_COLUMNS =
  "id, project_id, title, content, created_at, updated_at, ai_understanding, ai_analyzed_at, ai_suggested_tasks, ai_tasks_generated_at";

type StoredSuggestedTask = {
  id?: string;
  title: string;
  timeEntryId?: string | null;
};

type NoteRow = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  ai_understanding: NoteUnderstanding | null;
  ai_analyzed_at: string | null;
  ai_suggested_tasks: StoredSuggestedTask[] | null;
  ai_tasks_generated_at: string | null;
};

function normalizeSuggestedTasks(tasks: StoredSuggestedTask[] | null): SuggestedTask[] | null {
  if (!tasks) return null;

  return tasks.map((task, index) => ({
    id: task.id ?? `legacy-${index}`,
    title: task.title,
    timeEntryId: task.timeEntryId ?? null,
  }));
}

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    aiUnderstanding: row.ai_understanding ?? null,
    aiAnalyzedAt: row.ai_analyzed_at ?? null,
    aiSuggestedTasks: normalizeSuggestedTasks(row.ai_suggested_tasks),
    aiTasksGeneratedAt: row.ai_tasks_generated_at ?? null,
  };
}

export class SupabaseNoteRepository implements INoteRepository {
  async findByProjectId(projectId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_COLUMNS)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data as NoteRow[]).map(toNote);
  }

  async findById(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_COLUMNS)
      .eq("id", id)
      .single();

    if (error) return null;

    return toNote(data as NoteRow);
  }

  async create(input: { projectId: string; title: string; content: string }): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .insert({ project_id: input.projectId, title: input.title, content: input.content })
      .select(NOTE_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return toNote(data as NoteRow);
  }

  async update(id: string, input: { title: string; content: string }): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({ title: input.title, content: input.content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(NOTE_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return toNote(data as NoteRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async saveUnderstanding(id: string, understanding: NoteUnderstanding): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({ ai_understanding: understanding, ai_analyzed_at: new Date().toISOString() })
      .eq("id", id)
      .select(NOTE_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return toNote(data as NoteRow);
  }

  async saveSuggestedTasks(id: string, tasks: SuggestedTask[]): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({ ai_suggested_tasks: tasks, ai_tasks_generated_at: new Date().toISOString() })
      .eq("id", id)
      .select(NOTE_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return toNote(data as NoteRow);
  }

  async linkSuggestedTaskToTimeEntry(noteId: string, suggestedTaskId: string, timeEntryId: string): Promise<Note> {
    const note = await this.findById(noteId);
    if (!note) throw new Error("Anotação não encontrada");

    const tasks = note.aiSuggestedTasks ?? [];
    const task = tasks.find((candidate) => candidate.id === suggestedTaskId);
    if (!task) throw new Error("Tarefa sugerida não encontrada");
    if (task.timeEntryId) throw new Error("Esta tarefa já possui um lançamento vinculado");

    const updatedTasks = tasks.map((candidate) =>
      candidate.id === suggestedTaskId ? { ...candidate, timeEntryId } : candidate,
    );

    const { data, error } = await supabase
      .from("notes")
      .update({ ai_suggested_tasks: updatedTasks })
      .eq("id", noteId)
      .select(NOTE_COLUMNS)
      .single();

    if (error) throw new Error(error.message);

    return toNote(data as NoteRow);
  }
}
