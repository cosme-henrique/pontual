import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  clientName: z.string().max(100).optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
