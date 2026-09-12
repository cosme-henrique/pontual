import { formatDuration } from "@/shared/lib/format";
import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getDashboardStats } from "@/features/dashboard/use-cases/get-dashboard-stats";
import { StatCard } from "./stat-card";

type DashboardStatsProps = {
  today: string;
  month: string;
};

export async function DashboardStats({ today, month }: DashboardStatsProps) {
  const repository = makeTimeEntryRepository();
  const stats = await getDashboardStats(repository, today, month);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Hoje" value={formatDuration(stats.todayMinutes)} sub="concluídas" />
      <StatCard label="Esta semana" value={formatDuration(stats.weekMinutes)} sub="concluídas" />
      <StatCard label="Este mês" value={formatDuration(stats.monthMinutes)} sub="concluídas" />
      <StatCard label="Lançamentos" value={formatDuration(stats.totalMinutes)} sub={month} />
    </div>
  );
}
