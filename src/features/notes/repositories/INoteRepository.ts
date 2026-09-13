import type { Note } from "../types";
import type { NoteUnderstanding } from "../schemas/note-understanding-schema";
import type { SuggestedTask } from "../schemas/note-suggested-tasks-schema";

export interface INoteRepository {
  findByProjectId(projectId: string): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  create(input: { projectId: string; title: string; content: string }): Promise<Note>;
  update(id: string, input: { title: string; content: string }): Promise<Note>;
  remove(id: string): Promise<void>;
  saveUnderstanding(id: string, understanding: NoteUnderstanding): Promise<Note>;
  saveSuggestedTasks(id: string, tasks: SuggestedTask[]): Promise<Note>;
  linkSuggestedTaskToTimeEntry(noteId: string, suggestedTaskId: string, timeEntryId: string): Promise<Note>;
}
