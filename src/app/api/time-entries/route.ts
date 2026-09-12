import { NextRequest, NextResponse } from "next/server";
import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getTimeEntries } from "@/features/time-entries/use-cases/get-time-entries";
import { parseTimeEntryListFilters } from "@/features/time-entries/schemas/time-entry-filters-schema";
import { getCurrentMonth } from "@/shared/lib/date";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { search, page, status } = parseTimeEntryListFilters({
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const month = searchParams.get("month") ?? getCurrentMonth();

  const repository = makeTimeEntryRepository();
  const result = await getTimeEntries(repository, { search, page, pageSize, month, status });

  return NextResponse.json(result);
}
