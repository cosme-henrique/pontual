"use client";

import { cn } from "@/shared/lib/cn";
import { useDataTableContext } from "../data-table-root/use-data-table-root";

type DataTablePaginationProps = {
  className?: string;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  for (let pageNumber = rangeStart; pageNumber <= rangeEnd; pageNumber++) {
    pages.push(pageNumber);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

export function DataTablePagination({ className }: DataTablePaginationProps) {
  const { props } = useDataTableContext();

  if (!props.onPageChange || props.totalCount === undefined) return null;

  const page = props.page ?? 1;
  const pageSize = props.pageSize ?? 10;
  const totalPages = Math.ceil(props.totalCount / pageSize);

  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, props.totalCount);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className={cn("flex items-center justify-center sm:justify-between", className)}>
      <span className="hidden text-sm text-zinc-400 sm:inline">
        {from}–{to} de {props.totalCount}
      </span>

      <nav aria-label="Paginação" className="flex items-center gap-1">
        <button
          onClick={() => props.onPageChange!(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-40"
        >
          <span aria-hidden="true">‹</span>
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400"
                aria-hidden="true"
              >
                ···
              </span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => props.onPageChange!(pageNumber)}
                aria-label={`Página ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors",
                  pageNumber === page
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700",
                )}
              >
                {pageNumber}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => props.onPageChange!(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
          className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-40"
        >
          Próximo
          <span aria-hidden="true">›</span>
        </button>
      </nav>
    </div>
  );
}
