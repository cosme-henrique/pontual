import { Badge } from "@/shared/ui";
import { TIME_ENTRY_STATUS_LABEL } from "../exporters/status-label";
import type { TimeEntryStatus } from "../types";

export const STATUS_BADGE: Record<TimeEntryStatus, React.ReactNode> = {
  done: <Badge variant="success">{TIME_ENTRY_STATUS_LABEL.done}</Badge>,
  pending: <Badge variant="warning">{TIME_ENTRY_STATUS_LABEL.pending}</Badge>,
  backlog: <Badge variant="outline">{TIME_ENTRY_STATUS_LABEL.backlog}</Badge>,
};
