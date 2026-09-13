import type { NoteUnderstanding } from "./schemas/note-understanding-schema";
import type { SuggestedTask } from "./schemas/note-suggested-tasks-schema";

export type Note = {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  aiUnderstanding: NoteUnderstanding | null;
  aiAnalyzedAt: string | null;
  aiSuggestedTasks: SuggestedTask[] | null;
  aiTasksGeneratedAt: string | null;
};
