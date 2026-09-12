import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";
import type { TimeEntry, TimeEntryStatus } from "../types";

type Params = {
  search?: string;
  page: number;
  pageSize: number;
  month: string; // "2026-08"
  projectId?: string;
  status?: TimeEntryStatus[];
};

type Result = {
  entries: TimeEntry[];
  totalCount: number;
};

export async function getTimeEntries(
  repository: ITimeEntryRepository,
  params: Params,
): Promise<Result> {
  return repository.findMany(params);
}
