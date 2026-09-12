import type { TimeEntryStatus } from "../types";

export type TimeEntryExportRow = {
  date: string; // ISO "2026-08-28"; entries sem data (backlog) ficam fora do relatório
  projectName: string;
  task: string;
  hours: number;
  status: TimeEntryStatus;
};

export type TimeEntryExportReport = {
  month: string; // "2026-08"
  monthLabel: string; // "Agosto de 2026"
  rows: TimeEntryExportRow[];
  totalHours: number;
  hourlyRate: number | null; // null = valor/hora não cadastrado pro mês
  totalToReceive: number | null;
};

export type TimeEntryExportFile = {
  buffer: Buffer;
  mimeType: string;
  fileExtension: string;
};

export interface ITimeEntryExporter {
  export(report: TimeEntryExportReport): Promise<TimeEntryExportFile>;
}
