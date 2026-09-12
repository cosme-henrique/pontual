"use client";

import { createContext, useContext } from "react";
import { useTable, type ReactTable, type SortingState, type ColumnDef } from "@tanstack/react-table";
import { buildColumns } from "../build-columns";
import { dataTableFeatures, type DataTableFeatures } from "../features";
import { type DataTableContextValue } from "../types";

type Row = Record<string, unknown>;

type DataTableContext = {
  table: ReactTable<DataTableFeatures, Row, { sorting: SortingState }>;
  props: DataTableContextValue;
};

export const DataTableContext = createContext<DataTableContext | null>(null);

export function useDataTableRoot<TData extends Row>(props: DataTableContextValue<TData>) {
  const columns = buildColumns(props.columns) as unknown as ColumnDef<DataTableFeatures, Row>[];

  const table = useTable(
    {
      features: dataTableFeatures,
      data: props.data as Row[],
      columns,
    },
    (state) => ({ sorting: state.sorting }),
  );

  return { table, props: props as DataTableContextValue };
}

export function useDataTableContext() {
  const ctx = useContext(DataTableContext);
  if (!ctx) throw new Error("useDataTableContext must be used inside DataTable.Root");
  return ctx;
}
