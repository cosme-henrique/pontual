import type { TimeEntryStatus } from "../types";

export const TIME_ENTRY_STATUS_LABEL: Record<TimeEntryStatus, string> = {
  done: "Concluído",
  pending: "Pendente",
  backlog: "Backlog",
};
