import { cn } from "@/shared/lib/cn";

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-zinc-200 px-6 py-4", className)}
      {...props}
    />
  );
}
