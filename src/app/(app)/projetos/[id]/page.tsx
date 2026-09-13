import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Separator, Tabs } from "@/shared/ui";
import { makeProjectRepository } from "@/features/projects/repositories/make-project-repository";
import { getProjectById } from "@/features/projects/use-cases/get-project-by-id";
import { ProjectDetailStats } from "@/features/projects/components/project-detail-stats";
import { StatCardsSkeleton } from "@/features/dashboard/components/stat-cards-skeleton";
import { DashboardTable } from "@/features/dashboard/components/dashboard-table";
import { TableSkeleton } from "@/features/dashboard/components/table-skeleton";
import { makeMonthFilterRepository } from "@/features/month-filter/repositories/make-month-filter-repository";
import { getSelectedMonth } from "@/features/month-filter/use-cases/get-selected-month";
import { parseTimeEntryListFilters, type TimeEntrySearchParams } from "@/features/time-entries/schemas/time-entry-filters-schema";
import { ProjectNotesPanel } from "@/features/notes/components/project-notes-panel";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<TimeEntrySearchParams>;
};

export default async function ProjectDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { search, page: currentPage, status: statusFilter } = parseTimeEntryListFilters(await searchParams);

  const repository = makeProjectRepository();
  const project = await getProjectById(repository, id);

  if (!project) notFound();

  const month = await getSelectedMonth(makeMonthFilterRepository());

  return (
    <main className="flex flex-col gap-8 px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-700">{project.name}</h1>
        {project.clientName && (
          <p className="mt-1 text-sm text-zinc-500">{project.clientName}</p>
        )}
      </div>

      <Suspense fallback={<StatCardsSkeleton />}>
        <ProjectDetailStats projectId={id} month={month} />
      </Suspense>

      <Separator />

      <Tabs.Root defaultValue="lancamentos">
        <Tabs.List>
          <Tabs.Trigger value="lancamentos">Lançamentos</Tabs.Trigger>
          <Tabs.Trigger value="anotacoes">Anotações</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="lancamentos" className="flex flex-col gap-4">
          <Suspense fallback={<TableSkeleton />}>
            <DashboardTable search={search} page={currentPage} month={month} projectId={id} status={statusFilter} />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="anotacoes">
          <ProjectNotesPanel projectId={id} />
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
