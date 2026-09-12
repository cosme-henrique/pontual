"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "@/shared/lib/cn";
import { formatTextWithAiAction } from "@/shared/services/ai/format-text-with-ai-action";

const input = tv({
  base: "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    error: {
      true: "border-red-500 focus-visible:ring-red-500",
    },
  },
});

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  prompt?: string;
};

export function Input({ error, className, prompt, value, onChange, disabled, ...props }: InputProps) {
  const [isPending, startTransition] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);

  if (!prompt) {
    return (
      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={input({ error, className })}
        {...props}
      />
    );
  }

  const currentValue = typeof value === "string" ? value : "";

  function handleFormat() {
    setAiError(null);
    startTransition(async () => {
      const result = await formatTextWithAiAction({ text: currentValue, prompt: prompt as string });
      if (result.success) {
        onChange?.({ target: { value: result.formattedText } } as React.ChangeEvent<HTMLInputElement>);
      } else {
        setAiError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          disabled={disabled || isPending}
          className={input({ error, className: cn("pr-10", className) })}
          {...props}
        />
        <button
          type="button"
          onClick={handleFormat}
          disabled={disabled || isPending || !currentValue.trim()}
          aria-label="Formatar com IA"
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      {aiError && (
        <p role="alert" className="text-sm text-red-600">
          {aiError}
        </p>
      )}
    </div>
  );
}

export type { InputProps };
