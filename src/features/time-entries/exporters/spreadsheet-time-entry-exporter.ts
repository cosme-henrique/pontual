import ExcelJS from "exceljs";
import type { ITimeEntryExporter, TimeEntryExportFile, TimeEntryExportReport } from "./types";
import { TIME_ENTRY_STATUS_LABEL } from "./status-label";

const DATA_COLUMNS = ["B", "C", "D", "E", "F"] as const;
const CENTERED_COLUMNS = ["B", "C", "E", "F"] as const;
const FIRST_DATA_ROW = 3;

function toExcelDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export class SpreadsheetTimeEntryExporter implements ITimeEntryExporter {
  async export(report: TimeEntryExportReport): Promise<TimeEntryExportFile> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tarefas");

    worksheet.mergeCells("B1:F1");
    worksheet.getCell("B1").value = "Controle de Tarefas";
    worksheet.getCell("B1").font = { name: "Inter", size: 14, bold: true };

    const headers = { B: "Data", C: "Projeto", D: "Tarefa", E: "Horas", F: "Status" };
    for (const column of DATA_COLUMNS) {
      const cell = worksheet.getCell(`${column}2`);
      cell.value = headers[column];
      cell.font = { name: "Inter", bold: true };
      cell.alignment = { horizontal: "center" };
    }
    worksheet.getCell("H2").value = "Total de Horas";
    worksheet.getCell("H2").font = { name: "Inter", bold: true };

    let currentRow = FIRST_DATA_ROW;
    for (const row of report.rows) {
      worksheet.getCell(`B${currentRow}`).value = toExcelDate(row.date);
      worksheet.getCell(`B${currentRow}`).numFmt = "dd/mm/yyyy";
      worksheet.getCell(`C${currentRow}`).value = row.projectName.toUpperCase();
      worksheet.getCell(`D${currentRow}`).value = row.task;
      worksheet.getCell(`E${currentRow}`).value = row.hours;
      worksheet.getCell(`F${currentRow}`).value = TIME_ENTRY_STATUS_LABEL[row.status].toUpperCase();

      for (const column of DATA_COLUMNS) {
        const cell = worksheet.getCell(`${column}${currentRow}`);
        cell.font = { name: "Inter", size: 11 };
        if ((CENTERED_COLUMNS as readonly string[]).includes(column)) {
          cell.alignment = { horizontal: "center" };
        }
      }

      currentRow += 1;
    }

    const lastDataRow = currentRow - 1;
    worksheet.getCell("H3").value = lastDataRow >= FIRST_DATA_ROW
      ? { formula: `SUM(E${FIRST_DATA_ROW}:E${lastDataRow})` }
      : 0;

    if (report.hourlyRate !== null) {
      worksheet.getCell("H5").value = "Total a Receber";
      worksheet.getCell("H6").value = { formula: `H3*${report.hourlyRate}` };
      worksheet.getCell("H6").numFmt = '"R$" #,##0.00';
    }

    worksheet.getColumn("B").width = 12;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 60;
    worksheet.getColumn("E").width = 8;
    worksheet.getColumn("F").width = 14;
    worksheet.getColumn("H").width = 16;

    const arrayBuffer = await workbook.xlsx.writeBuffer();

    return {
      buffer: Buffer.from(arrayBuffer as ArrayBuffer),
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileExtension: "xlsx",
    };
  }
}
