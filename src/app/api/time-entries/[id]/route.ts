import { NextResponse } from "next/server";
import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getTimeEntryById } from "@/features/time-entries/use-cases/get-time-entry-by-id";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const repository = makeTimeEntryRepository();
  const entry = await getTimeEntryById(repository, id);

  if (!entry) {
    return NextResponse.json({ error: "Lançamento não encontrado" }, { status: 404 });
  }

  return NextResponse.json(entry);
}
