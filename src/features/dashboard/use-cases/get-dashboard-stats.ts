import type { ITimeEntryRepository } from "@/features/time-entries/repositories/ITimeEntryRepository";
import type { DashboardStats } from "@/features/time-entries/types";

function getWeekStart(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  const day = d.getUTCDay(); // 0=Dom, 1=Seg...
  const diff = day === 0 ? 6 : day - 1; // dias desde segunda
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().split("T")[0];
}

export async function getDashboardStats(
  repository: ITimeEntryRepository,
  today: string, // "2026-08-28"
  month: string, // "2026-08"
): Promise<DashboardStats> {
  const weekStart = getWeekStart(today);

  const entries = await repository.findByMonth(month);
  const done = entries.filter((entry) => entry.status === "done");

  const todayMinutes = done
    .filter((entry) => entry.date === today)
    .reduce((sum, entry) => sum + entry.durationMinutes, 0);

  const weekMinutes = done
    .filter((entry) => entry.date !== null && entry.date >= weekStart && entry.date <= today)
    .reduce((sum, entry) => sum + entry.durationMinutes, 0);

  const monthMinutes = done
    .reduce((sum, entry) => sum + entry.durationMinutes, 0);

  const totalMinutes = entries
    .reduce((sum, entry) => sum + entry.durationMinutes, 0);

  return { todayMinutes, weekMinutes, monthMinutes, totalMinutes };
}
