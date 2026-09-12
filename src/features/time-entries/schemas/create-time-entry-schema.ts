import { z } from "zod";

export const createTimeEntrySchema = z
  .object({
    projectId: z.string().min(1, "Selecione um projeto"),
    task: z.string().min(1, "Descreva a tarefa").max(200),
    hasNoDate: z.boolean().default(false),
    date: z.string().optional(),
    hours: z.coerce.number().int().min(0).max(23),
    minutes: z.coerce.number().int().min(0).max(59),
    status: z.enum(["backlog", "pending", "done"]),
  })
  .refine((data) => data.hours > 0 || data.minutes > 0, {
    message: "A duração deve ser maior que zero",
    path: ["hours"],
  })
  .refine((data) => data.hasNoDate || !!data.date, {
    message: "Selecione uma data",
    path: ["date"],
  });

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
