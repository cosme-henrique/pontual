import { Skeleton } from "@/shared/ui";

export function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-6 gap-4 px-4 py-2">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Skeleton key={index} className="h-4" />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="grid grid-cols-6 gap-4 rounded-lg border border-zinc-100 px-4 py-3">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <Skeleton key={col} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
