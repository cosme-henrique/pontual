import { z } from "zod";
import { TIME_ENTRY_STATUSES } from "../types";

export const quickEntryDraftSchema = z.object({
  projectId: z.string().nullable(),
  task: z.string().min(1),
  date: z.string().nullable(),
  durationMinutes: z.number().int().positive(),
  status: z.enum(TIME_ENTRY_STATUSES),
});

export type QuickEntryDraft = z.infer<typeof quickEntryDraftSchema>;
