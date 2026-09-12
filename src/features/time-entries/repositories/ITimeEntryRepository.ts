import type { Project, TimeEntry, TimeEntryStatus } from "../types";

export interface ITimeEntryRepository {
  findMany(params: {
    search?: string;
    page: number;
    pageSize: number;
    month: string; // "2026-08"
    projectId?: string;
    status?: TimeEntryStatus[];
  }): Promise<{ entries: TimeEntry[]; totalCount: number }>;

  findByMonth(month: string): Promise<TimeEntry[]>;

  getProjects(): Promise<Project[]>;

  create(input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: TimeEntryStatus;
  }): Promise<TimeEntry>;

  update(id: string, input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: TimeEntryStatus;
  }): Promise<TimeEntry>;

  remove(id: string): Promise<void>;
}
