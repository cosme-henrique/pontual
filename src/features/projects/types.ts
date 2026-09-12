import type { Project } from "@/features/time-entries/types";

export type { Project };

export type ProjectStats = {
  totalMinutes: number;
  doneMinutes: number;
  pendingMinutes: number;
  backlogMinutes: number;
  entriesCount: number;
};
