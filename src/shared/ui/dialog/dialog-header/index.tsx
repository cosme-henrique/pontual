import { cn } from "@/shared/lib/cn";

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-zinc-200 px-6 py-5", className)}
      {...props}
    />
  );
}
