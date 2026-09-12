export interface IAiProvider {
  generateText(input: { system?: string; prompt: string; jsonMode?: boolean }): Promise<string>;
}
