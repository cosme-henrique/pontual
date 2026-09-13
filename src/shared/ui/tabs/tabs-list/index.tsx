import { cn } from "@/shared/lib/cn";

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-1 border-b border-zinc-200", className)}
      {...props}
    />
  );
}
