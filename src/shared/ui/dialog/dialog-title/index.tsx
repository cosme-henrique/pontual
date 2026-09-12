import { cn } from "@/shared/lib/cn";

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold text-zinc-700", className)} {...props} />
  );
}
