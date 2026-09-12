export type ColumnConfig<TData extends Record<string, unknown>> = {
  key: keyof TData & string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: TData) => React.ReactNode;
};

export type DataTableContextValue<TData extends Record<string, unknown> = Record<string, unknown>> =
  {
    data: TData[];
    columns: ColumnConfig<TData>[];
    search?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    filters?: React.ReactNode;
    totalCount?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    loading?: boolean;
    emptyMessage?: string;
  };
