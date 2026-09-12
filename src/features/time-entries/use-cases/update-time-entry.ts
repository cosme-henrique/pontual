import type { ITimeEntryRepository } from "../repositories/ITimeEntryRepository";
import type { CreateTimeEntryInput } from "../schemas/create-time-entry-schema";

export function updateTimeEntry(repository: ITimeEntryRepository, id: string, input: CreateTimeEntryInput) {
  const durationMinutes = input.hours * 60 + input.minutes;

  return repository.update(id, {
    projectId: input.projectId,
    task: input.task,
    date: input.hasNoDate ? null : (input.date ?? null),
    durationMinutes,
    status: input.hasNoDate ? "backlog" : input.status,
  });
}
