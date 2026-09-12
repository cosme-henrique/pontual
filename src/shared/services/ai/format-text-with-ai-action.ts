"use server";

import { z } from "zod";
import { makeAiProvider } from "./make-ai-provider";

const schema = z.object({
  text: z.string().min(1).max(300),
  prompt: z.string().min(1),
});

type ActionResult =
  | { success: true; formattedText: string }
  | { success: false; error: string };

export async function formatTextWithAiAction(input: { text: string; prompt: string }): Promise<ActionResult> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const aiProvider = makeAiProvider();

  try {
    const formattedText = await aiProvider.generateText({
      system: `${parsed.data.prompt}\n\nResponda apenas com o texto formatado, sem comentários, aspas ou explicações.`,
      prompt: parsed.data.text,
    });

    return { success: true, formattedText };
  } catch {
    return { success: false, error: "Não foi possível formatar o texto. Tente novamente." };
  }
}
