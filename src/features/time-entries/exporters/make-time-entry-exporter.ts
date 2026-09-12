import type { ITimeEntryExporter } from "./types";
import { SpreadsheetTimeEntryExporter } from "./spreadsheet-time-entry-exporter";
import { PdfTimeEntryExporter } from "./pdf-time-entry-exporter";

export type TimeEntryExportFormat = "xlsx" | "pdf";

export function makeTimeEntryExporter(format: TimeEntryExportFormat): ITimeEntryExporter {
  if (format === "pdf") return new PdfTimeEntryExporter();
  return new SpreadsheetTimeEntryExporter();
}
