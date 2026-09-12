"use client";

import { cn } from "@/shared/lib/cn";
import { Input } from "../../input";
import { useDataTableContext } from "../data-table-root/use-data-table-root";

type DataTableToolbarProps = {
  className?: string;
};

export function DataTableToolbar({ className }: DataTableToolbarProps) {
  const { props } = useDataTableContext();
  const hasSearch = props.onSearchChange !== undefined;
  const hasFilters = props.filters !== undefined;

  if (!hasSearch && !hasFilters) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {hasSearch && (
        <Input
          placeholder={props.searchPlaceholder ?? "Buscar..."}
          value={props.search ?? ""}
          onChange={(event) => props.onSearchChange!(event.target.value)}
          className="max-w-xs"
        />
      )}
      {hasFilters && <div className="flex flex-wrap items-center gap-2">{props.filters}</div>}
    </div>
  );
}
