import { z } from "zod";
import { parseListParam } from "@/shared/lib/query-params";
import { TIME_ENTRY_STATUSES, type TimeEntryStatus } from "../types";

const timeEntryStatusSchema = z.enum(TIME_ENTRY_STATUSES);

export function parseTimeEntryStatusFilter(values: string[]): TimeEntryStatus[] {
  return values.filter(
    (value): value is TimeEntryStatus => timeEntryStatusSchema.safeParse(value).success,
  );
}

export type TimeEntrySearchParams = {
  search?: string;
  page?: string;
  status?: string;
};

export type TimeEntryListFilters = {
  search: string;
  page: number;
  status: TimeEntryStatus[];
};

export function parseTimeEntryListFilters(searchParams: TimeEntrySearchParams): TimeEntryListFilters {
  return {
    search: searchParams.search ?? "",
    page: Number(searchParams.page ?? "1"),
    status: parseTimeEntryStatusFilter(parseListParam(searchParams.status)),
  };
}
