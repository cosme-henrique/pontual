import { z } from "zod";

const schema = z.object({
  APP_ENV: z.enum(["development", "production"]).default("production"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

const parsed = schema.safeParse({
  APP_ENV: process.env.APP_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Variáveis de ambiente inválidas:\n${parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")}`
  );
}

export const env = parsed.data;
