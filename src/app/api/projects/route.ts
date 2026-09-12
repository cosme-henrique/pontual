import { makeTimeEntryRepository } from "@/features/time-entries/repositories/make-time-entry-repository";
import { getProjects } from "@/features/time-entries/use-cases/get-projects";

export async function GET() {
  const repository = makeTimeEntryRepository();
  const projects = await getProjects(repository);
  return Response.json(projects);
}
