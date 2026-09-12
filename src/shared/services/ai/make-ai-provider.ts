import type { IAiProvider } from "./IAiProvider";
import { OpenAiIA } from "./openai-ai-provider";

export function makeAiProvider(): IAiProvider {
  return new OpenAiIA();
  // Trocar de provedor no futuro (Claude, modelo local etc.) muda só esta linha.
}
