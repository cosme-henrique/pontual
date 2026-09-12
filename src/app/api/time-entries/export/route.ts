import { NextRequest, NextResponse } from "next/server";
import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { makeMonthlyRateRepository } from "@/features/monthly-rates/repositories/make-monthly-rate-repository";
import { buildTimeEntryExportReport } from "@/features/time-entries/use-cases/build-time-entry-export-report";
import { makeTimeEntryExporter, type TimeEntryExportFormat } from "@/features/time-entries/exporters/make-time-entry-exporter";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const format: TimeEntryExportFormat = searchParams.get("format") === "pdf" ? "pdf" : "xlsx";

  const timeEntryRepository = makeTimeEntryRepository();
  const monthlyRateRepository = makeMonthlyRateRepository();

  const report = await buildTimeEntryExportReport({ timeEntryRepository, monthlyRateRepository, month });

  const exporter = makeTimeEntryExporter(format);
  const { buffer, mimeType, fileExtension } = await exporter.export(report);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="lancamentos-${month}.${fileExtension}"`,
    },
  });
}
