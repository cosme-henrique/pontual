"use client";

import { cn } from "@/shared/lib/cn";
import { DataTableContext, useDataTableRoot } from "./use-data-table-root";
import { type DataTableContextValue } from "../types";

type DataTableRootProps<TData extends Record<string, unknown>> = DataTableContextValue<TData> & {
  className?: string;
  children: React.ReactNode;
};

export function DataTableRoot<TData extends Record<string, unknown>>({
  className,
  children,
  ...props
}: DataTableRootProps<TData>) {
  const value = useDataTableRoot(props);

  return (
    <DataTableContext.Provider value={value}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </DataTableContext.Provider>
  );
}
