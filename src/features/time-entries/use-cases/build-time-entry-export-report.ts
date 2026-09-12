import { formatMonthLabel } from "@/shared/lib/format";
import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";
import type { IMonthlyRateRepository } from "@/features/monthly-rates/repositories/IMonthlyRateRepository";
import type { TimeEntryExportReport } from "../exporters/types";

type Params = {
  timeEntryRepository: ITimeEntryRepository;
  monthlyRateRepository: IMonthlyRateRepository;
  month: string;
};

export async function buildTimeEntryExportReport({
  timeEntryRepository,
  monthlyRateRepository,
  month,
}: Params): Promise<TimeEntryExportReport> {
  const [entries, monthlyRate] = await Promise.all([
    timeEntryRepository.findByMonth(month),
    monthlyRateRepository.findByMonth(month),
  ]);

  const rows = entries
    .filter((entry): entry is typeof entry & { date: string } => entry.date !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      date: entry.date,
      projectName: entry.project.name,
      task: entry.task,
      hours: entry.durationMinutes / 60,
      status: entry.status,
    }));

  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  const hourlyRate = monthlyRate?.hourlyRate ?? null;

  return {
    month,
    monthLabel: formatMonthLabel(month),
    rows,
    totalHours,
    hourlyRate,
    totalToReceive: hourlyRate !== null ? totalHours * hourlyRate : null,
  };
}
