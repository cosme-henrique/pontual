"use client";

import { Card } from "@/shared/ui";
import { useValuesVisibility } from "@/features/values-visibility/components/values-visibility-context";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
};

export function StatCard({ label, value, sub }: StatCardProps) {
  const { isVisible } = useValuesVisibility();

  return (
    <Card.Root className="flex-1">
      <Card.Content className="pt-6">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-zinc-700">{isVisible ? value : "••••"}</p>
        {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
      </Card.Content>
    </Card.Root>
  );
}
