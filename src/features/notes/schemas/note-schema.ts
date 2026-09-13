import { z } from "zod";

export const noteSchema = z.object({
  projectId: z.string().min(1, "Projeto é obrigatório"),
  title: z.string().min(1, "Título é obrigatório").max(200),
  content: z.string().min(1, "Anotação é obrigatória"),
});

export type NoteInput = z.infer<typeof noteSchema>;

export const updateNoteSchema = noteSchema.omit({ projectId: true });

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
