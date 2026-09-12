import { formatDuration } from "@/shared/lib/format";
import { makeProjectRepository } from "../repositories/make-project-repository";
import { getProjectStats } from "../use-cases/get-project-stats";
import { StatCard } from "@/features/dashboard/components/stat-card";

type ProjectDetailStatsProps = {
  projectId: string;
  month: string;
};

export async function ProjectDetailStats({ projectId, month }: ProjectDetailStatsProps) {
  const repository = makeProjectRepository();
  const stats = await getProjectStats(repository, projectId, month);

  return (
    <div className="flex gap-4">
      <StatCard label="Total no mês" value={formatDuration(stats.totalMinutes)} sub={month} />
      <StatCard label="Concluído" value={formatDuration(stats.doneMinutes)} sub="done" />
      <StatCard label="Pendente" value={formatDuration(stats.pendingMinutes)} sub="pending" />
      <StatCard label="Lançamentos" value={String(stats.entriesCount)} sub="no mês" />
    </div>
  );
}
