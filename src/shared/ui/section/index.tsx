import { cn } from "@/shared/lib/cn";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="border-b border-zinc-200 pb-2 text-xl font-semibold text-zinc-700">
        {title}
      </h2>
      {children}
    </section>
  );
}
