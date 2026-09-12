import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getTimeEntries } from "@/features/time-entries/use-cases/get-time-entries";
import { getProjects } from "@/features/time-entries/use-cases/get-projects";
import { parseTimeEntryListFilters, type TimeEntrySearchParams } from "@/features/time-entries/schemas/time-entry-filters-schema";
import { TimeEntriesTable } from "@/features/dashboard/components/time-entries-table";
import { NewEntryButton } from "@/features/dashboard/components/new-entry-button";
import { ExportMenu } from "@/features/time-entries/components/export-menu";
import { makeMonthFilterRepository } from "@/features/month-filter/repositories/make-month-filter-repository";
import { getSelectedMonth } from "@/features/month-filter/use-cases/get-selected-month";

type SearchParams = Promise<TimeEntrySearchParams>;

export default async function LancamentosPage({ searchParams }: { searchParams: SearchParams }) {
  const { search, page: currentPage, status: statusFilter } = parseTimeEntryListFilters(await searchParams);
  const month = await getSelectedMonth(makeMonthFilterRepository());

  const repository = makeTimeEntryRepository();

  const [{ entries, totalCount }, projects] = await Promise.all([
    getTimeEntries(repository, { search, page: currentPage, pageSize: 15, month, status: statusFilter }),
    getProjects(repository),
  ]);

  return (
    <main className="flex flex-col gap-8 px-8 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-700">Lançamentos</h1>
            <p className="mt-1 text-sm text-zinc-500">Gerencie todos os seus lançamentos de horas.</p>
          </div>
          <NewEntryButton />
        </div>

        <ExportMenu month={month} />
      </div>

      <TimeEntriesTable
        data={entries}
        totalCount={totalCount}
        page={currentPage}
        projects={projects}
        showActions
      />
    </main>
  );
}
