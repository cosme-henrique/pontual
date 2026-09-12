import { DataTableRoot } from "./data-table-root";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableContent } from "./data-table-content";
import { DataTablePagination } from "./data-table-pagination";

export const DataTable = {
  Root: DataTableRoot,
  Toolbar: DataTableToolbar,
  Content: DataTableContent,
  Pagination: DataTablePagination,
};

export type { ColumnConfig } from "./types";
