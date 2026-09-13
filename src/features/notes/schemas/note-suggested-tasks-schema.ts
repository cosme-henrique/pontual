import { z } from "zod";

const aiSuggestedTaskSchema = z.object({
  title: z.string().min(1),
});

export const suggestedTasksResponseSchema = z.object({
  tasks: z.array(aiSuggestedTaskSchema).min(1).max(8),
});

export const suggestedTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  timeEntryId: z.string().nullable(),
});

export type SuggestedTask = z.infer<typeof suggestedTaskSchema>;
