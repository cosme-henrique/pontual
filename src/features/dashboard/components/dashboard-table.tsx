import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getTimeEntries } from "@/features/time-entries/use-cases/get-time-entries";
import { getProjects } from "@/features/time-entries/use-cases/get-projects";
import type { TimeEntryStatus } from "@/features/time-entries/types";
import { TimeEntriesTable } from "./time-entries-table";

type DashboardTableProps = {
  search: string;
  page: number;
  month: string;
  projectId?: string;
  status?: TimeEntryStatus[];
};

export async function DashboardTable({ search, page, month, projectId, status }: DashboardTableProps) {
  const repository = makeTimeEntryRepository();
  const [{ entries, totalCount }, projects] = await Promise.all([
    getTimeEntries(repository, { search, page, pageSize: 10, month, projectId, status }),
    getProjects(repository),
  ]);

  return (
    <TimeEntriesTable data={entries} totalCount={totalCount} page={page} projects={projects} showActions />
  );
}
