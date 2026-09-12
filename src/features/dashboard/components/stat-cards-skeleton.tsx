import { Card, Skeleton } from "@/shared/ui";

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((index) => (
        <Card.Root key={index} className="flex-1">
          <Card.Content className="pt-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-9 w-28" />
            <Skeleton className="mt-2 h-3 w-16" />
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  );
}
