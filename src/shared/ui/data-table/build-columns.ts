import { type ColumnDef } from "@tanstack/react-table";
import { type DataTableFeatures } from "./features";
import { type ColumnConfig } from "./types";

export function buildColumns<TData extends Record<string, unknown>>(
  configs: ColumnConfig<TData>[],
): ColumnDef<DataTableFeatures, TData>[] {
  return configs.map((config) => ({
    id: config.key,
    accessorKey: config.key,
    enableSorting: config.sortable ?? false,
    header: config.label,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: (ctx: any) =>
      config.render
        ? config.render(ctx.getValue(), ctx.row.original as TData)
        : String(ctx.getValue() ?? ""),
    meta: { align: config.align ?? "left" },
  })) as unknown as ColumnDef<DataTableFeatures, TData>[];
}
