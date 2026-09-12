import { Suspense } from "react";
import Link from "next/link";
import { Button, Separator } from "@/shared/ui";
import { NewEntryButton } from "@/features/dashboard/components/new-entry-button";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { DashboardTable } from "@/features/dashboard/components/dashboard-table";
import { StatCardsSkeleton } from "@/features/dashboard/components/stat-cards-skeleton";
import { TableSkeleton } from "@/features/dashboard/components/table-skeleton";
import { makeMonthFilterRepository } from "@/features/month-filter/repositories/make-month-filter-repository";
import { getSelectedMonth } from "@/features/month-filter/use-cases/get-selected-month";
import { parseTimeEntryListFilters, type TimeEntrySearchParams } from "@/features/time-entries/schemas/time-entry-filters-schema";
import { makeValuesVisibilityRepository } from "@/features/values-visibility/repositories/make-values-visibility-repository";
import { getValuesVisibility } from "@/features/values-visibility/use-cases/get-values-visibility";
import { ValuesVisibilityProvider } from "@/features/values-visibility/components/values-visibility-context";
import { ValuesVisibilityToggle } from "@/features/values-visibility/components/values-visibility-toggle";
import { getGreeting, getToday } from "@/shared/lib/date";
import { formatFullDate } from "@/shared/lib/format";

type SearchParams = Promise<TimeEntrySearchParams>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { search, page: currentPage, status: statusFilter } = parseTimeEntryListFilters(await searchParams);

  const today = getToday();
  const greeting = getGreeting(new Date().getHours());
  const month = await getSelectedMonth(makeMonthFilterRepository());
  const areValuesVisible = await getValuesVisibility(makeValuesVisibilityRepository());

  return (
    <main className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-700">{greeting} 👋</h1>
          <p className="mt-1 text-sm text-zinc-500">{formatFullDate(new Date())}</p>
        </div>
        <NewEntryButton />
      </div>

      <ValuesVisibilityProvider initialVisible={areValuesVisible}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <ValuesVisibilityToggle />
          </div>

          <Suspense fallback={<StatCardsSkeleton />}>
            <DashboardStats today={today} month={month} />
          </Suspense>
        </div>
      </ValuesVisibilityProvider>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-700">Lançamentos recentes</h2>
          <Link href="/lancamentos">
            <Button variant="ghost" size="sm">Ver todos</Button>
          </Link>
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <DashboardTable search={search} page={currentPage} month={month} status={statusFilter} />
        </Suspense>
      </div>
    </main>
  );
}
