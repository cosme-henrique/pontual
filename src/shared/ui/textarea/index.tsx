import { tv } from "tailwind-variants";

const textarea = tv({
  base: "flex min-h-[80px] w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    error: {
      true: "border-red-500 focus-visible:ring-red-500",
    },
  },
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function Textarea({ error, className, ...props }: TextareaProps) {
  return <textarea className={textarea({ error, className })} {...props} />;
}

export type { TextareaProps };
