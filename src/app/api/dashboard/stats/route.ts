import { NextRequest, NextResponse } from "next/server";
import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getDashboardStats } from "@/features/dashboard/use-cases/get-dashboard-stats";
import { getCurrentMonth } from "@/shared/lib/date";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month") ?? getCurrentMonth();

  const repository = makeTimeEntryRepository();
  const today = new Date().toISOString().split("T")[0];
  const stats = await getDashboardStats(repository, today, month);
  return NextResponse.json(stats);
}
