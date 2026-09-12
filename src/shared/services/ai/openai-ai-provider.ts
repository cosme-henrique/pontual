import OpenAI from "openai";
import { env } from "@/shared/utils/envs";
import type { IAiProvider } from "./IAiProvider";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export class OpenAiIA implements IAiProvider {
  constructor(private readonly model: string = "gpt-4o-mini") {}

  async generateText({ system, prompt, jsonMode }: { system?: string; prompt: string; jsonMode?: boolean }): Promise<string> {
    const response = await client.chat.completions.create({
      model: this.model,
      response_format: jsonMode ? { type: "json_object" } : undefined,
      messages: [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        { role: "user" as const, content: prompt },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Resposta vazia da IA");

    return text.trim();
  }
}
