export const TIME_ENTRY_STATUSES = ["backlog", "pending", "done"] as const;

export type TimeEntryStatus = (typeof TIME_ENTRY_STATUSES)[number];

export type Project = {
  id: string;
  name: string;
  clientName?: string;
};

export type TimeEntry = {
  id: string;
  userId: string;
  projectId: string;
  project: Project;
  task: string;
  date: string | null; // ISO "2026-08-28"; null = sem previsão de início (backlog)
  durationMinutes: number;
  status: TimeEntryStatus;
  createdAt: string;
};

export type DashboardStats = {
  todayMinutes: number;   // done + hoje
  weekMinutes: number;    // done + semana atual
  monthMinutes: number;   // done + mês atual
  totalMinutes: number;   // todos os status + mês atual
};
