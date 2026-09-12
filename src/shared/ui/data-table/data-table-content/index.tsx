"use client";

import { flexRender } from "@tanstack/react-table";
import { cn } from "@/shared/lib/cn";
import { Table } from "../../table";
import { useDataTableContext } from "../data-table-root/use-data-table-root";

type DataTableContentProps = {
  className?: string;
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getAlign(meta: unknown): keyof typeof alignClass {
  if (meta && typeof meta === "object" && "align" in meta) {
    return (meta as { align: keyof typeof alignClass }).align ?? "left";
  }
  return "left";
}

export function DataTableContent({ className }: DataTableContentProps) {
  const { table, props } = useDataTableContext();
  const rows = table.getRowModel().rows;

  return (
    <Table.Root className={className}>
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const align = getAlign(header.column.columnDef.meta);
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();

              return (
                <Table.Head
                  key={header.id}
                  className={cn(
                    alignClass[align],
                    canSort && "cursor-pointer select-none",
                  )}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {flexRender(header.column.columnDef.header as any, header.getContext() as any)}
                  {sorted === "asc" && " ↑"}
                  {sorted === "desc" && " ↓"}
                </Table.Head>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {props.loading ? (
          <Table.Row>
            <Table.Cell
              colSpan={table.getAllColumns().length}
              className="py-10 text-center text-zinc-400"
            >
              Carregando...
            </Table.Cell>
          </Table.Row>
        ) : rows.length === 0 ? (
          <Table.Row>
            <Table.Cell
              colSpan={table.getAllColumns().length}
              className="py-10 text-center text-zinc-400"
            >
              {props.emptyMessage ?? "Nenhum resultado encontrado."}
            </Table.Cell>
          </Table.Row>
        ) : (
          rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const align = getAlign(cell.column.columnDef.meta);
                return (
                  <Table.Cell key={cell.id} className={alignClass[align]}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {flexRender(cell.column.columnDef.cell as any, cell.getContext() as any)}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}
