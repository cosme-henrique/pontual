import path from "node:path";
import pdfMake from "pdfmake";
import type { ITimeEntryExporter, TimeEntryExportFile, TimeEntryExportReport } from "./types";
import { TIME_ENTRY_STATUS_LABEL } from "./status-label";

const ROBOTO_FONTS_DIR = path.join(process.cwd(), "node_modules/pdfmake/fonts/Roboto");

pdfMake.setFonts({
  Roboto: {
    normal: path.join(ROBOTO_FONTS_DIR, "Roboto-Regular.ttf"),
    bold: path.join(ROBOTO_FONTS_DIR, "Roboto-Medium.ttf"),
    italics: path.join(ROBOTO_FONTS_DIR, "Roboto-Italic.ttf"),
    bolditalics: path.join(ROBOTO_FONTS_DIR, "Roboto-MediumItalic.ttf"),
  },
});
pdfMake.setLocalAccessPolicy(() => true);
pdfMake.setUrlAccessPolicy(() => false);

function formatDateForPdf(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export class PdfTimeEntryExporter implements ITimeEntryExporter {
  async export(report: TimeEntryExportReport): Promise<TimeEntryExportFile> {
    const tableBody = [
      ["Data", "Projeto", "Tarefa", "Horas", "Status"].map((text) => ({ text, bold: true, fillColor: "#f4f4f5" })),
      ...report.rows.map((row) => [
        formatDateForPdf(row.date),
        row.projectName.toUpperCase(),
        row.task,
        row.hours.toString(),
        TIME_ENTRY_STATUS_LABEL[row.status],
      ]),
    ];

    const totalsContent = [
      { text: `Total de Horas: ${report.totalHours}h`, style: "total", margin: [0, 16, 0, 0] as [number, number, number, number] },
      ...(report.hourlyRate !== null
        ? [
            { text: `Valor/hora: ${formatCurrency(report.hourlyRate)}` },
            { text: `Total a Receber: ${formatCurrency(report.totalToReceive!)}`, style: "total" },
          ]
        : []),
    ];

    const pdfDocument = pdfMake.createPdf({
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: "Controle de Tarefas", style: "title" },
        { text: report.monthLabel, style: "subtitle", margin: [0, 0, 0, 12] },
        {
          table: {
            headerRows: 1,
            widths: [55, 90, "*", 40, 65],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
        ...totalsContent,
      ],
      styles: {
        title: { fontSize: 16, bold: true },
        subtitle: { fontSize: 11, color: "#71717a" },
        total: { fontSize: 12, bold: true },
      },
      defaultStyle: { font: "Roboto", fontSize: 9 },
    });

    const buffer = await pdfDocument.getBuffer();

    return {
      buffer,
      mimeType: "application/pdf",
      fileExtension: "pdf",
    };
  }
}
