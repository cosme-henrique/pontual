import { z } from "zod";

export const noteUnderstandingSchema = z.object({
  objective: z.string().nullable(),
  identifiedPoints: z.array(z.string()),
  dependencies: z.array(z.string()),
  questions: z.array(z.string()),
});

export type NoteUnderstanding = z.infer<typeof noteUnderstandingSchema>;
