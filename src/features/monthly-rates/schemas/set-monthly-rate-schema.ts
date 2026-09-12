import { z } from "zod";

export const setMonthlyRateSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato de mês inválido"),
  hourlyRate: z.coerce.number().min(0, "O valor da hora não pode ser negativo"),
});

export type SetMonthlyRateInput = z.infer<typeof setMonthlyRateSchema>;
