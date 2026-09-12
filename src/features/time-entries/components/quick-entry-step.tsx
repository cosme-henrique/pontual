"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button, Textarea } from "@/shared/ui";
import { parseQuickEntryAction } from "../actions/parse-quick-entry-action";
import type { QuickEntryDraft } from "../schemas/quick-entry-draft-schema";

type QuickEntryStepProps = {
  initialText?: string;
  onGenerated: (text: string, draft: QuickEntryDraft) => void;
  onManual: () => void;
};

export function QuickEntryStep({ initialText = "", onGenerated, onManual }: QuickEntryStepProps) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await parseQuickEntryAction(text);
      if (result.success) {
        onGenerated(text, result.draft);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 px-10 py-8">
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ex: reunião com cliente X hoje, 1h30, projeto Y"
        rows={4}
        aria-label="Descreva o lançamento"
        disabled={isPending}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onManual}
          disabled={isPending}
          className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline disabled:opacity-50"
        >
          Prefiro preencher manualmente
        </button>

        <Button type="button" onClick={handleGenerate} disabled={isPending || !text.trim()}>
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles size={16} aria-hidden="true" />
              Gerar lançamento
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
