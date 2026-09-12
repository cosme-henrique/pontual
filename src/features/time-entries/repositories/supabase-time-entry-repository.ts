import { supabase } from "@/shared/lib/supabase";
import { getMonthEndExclusive } from "@/shared/lib/date";
import type { ITimeEntryRepository } from "./ITimeEntryRepository";
import type { Project, TimeEntry, TimeEntryStatus } from "../types";

type TimeEntryRow = {
  id: string;
  user_id: string;
  project_id: string;
  task: string;
  date: string | null;
  duration_minutes: number;
  status: TimeEntryStatus;
  created_at: string;
  projects: { id: string; name: string; client_name: string | null };
};

function toTimeEntry(row: TimeEntryRow): TimeEntry {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    project: {
      id: row.projects.id,
      name: row.projects.name,
      clientName: row.projects.client_name ?? undefined,
    },
    task: row.task,
    date: row.date,
    durationMinutes: row.duration_minutes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export class SupabaseTimeEntryRepository implements ITimeEntryRepository {
  async findMany({ search, page, pageSize, month, projectId, status }: {
    search?: string;
    page: number;
    pageSize: number;
    month: string;
    projectId?: string;
    status?: TimeEntryStatus[];
  }) {
    const from = `${month}-01`;
    const to = getMonthEndExclusive(month);

    let query = supabase
      .from("time_entries")
      .select("*, projects(id, name, client_name)", { count: "exact" })
      .or(`and(date.gte.${from},date.lt.${to}),date.is.null`)
      .order("date", { ascending: false, nullsFirst: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.ilike("task", `%${search}%`);
    }

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    if (status && status.length > 0) {
      query = query.in("status", status);
    }

    const { data, count, error } = await query;

    if (error) {
      if (error.code === "PGRST103") {
        return { entries: [], totalCount: await this.countMany({ search, month, projectId, status }) };
      }
      throw new Error(error.message);
    }

    return {
      entries: (data as TimeEntryRow[]).map(toTimeEntry),
      totalCount: count ?? 0,
    };
  }

  private async countMany({ search, month, projectId, status }: {
    search?: string;
    month: string;
    projectId?: string;
    status?: TimeEntryStatus[];
  }) {
    const from = `${month}-01`;
    const to = getMonthEndExclusive(month);

    let query = supabase
      .from("time_entries")
      .select("id", { count: "exact", head: true })
      .or(`and(date.gte.${from},date.lt.${to}),date.is.null`);

    if (search) {
      query = query.ilike("task", `%${search}%`);
    }

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    if (status && status.length > 0) {
      query = query.in("status", status);
    }

    const { count, error } = await query;

    if (error) throw new Error(error.message);

    return count ?? 0;
  }

  async findByMonth(month: string) {
    const { data, error } = await supabase
      .from("time_entries")
      .select("*, projects(id, name, client_name)")
      .gte("date", `${month}-01`)
      .lt("date", getMonthEndExclusive(month));

    if (error) throw new Error(error.message);

    return (data as TimeEntryRow[]).map(toTimeEntry);
  }

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, client_name")
      .order("name");

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      clientName: row.client_name ?? undefined,
    }));
  }

  async create(input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: TimeEntryStatus;
  }) {
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        project_id: input.projectId,
        task: input.task,
        date: input.date,
        duration_minutes: input.durationMinutes,
        status: input.status,
        user_id: "anonymous",
      })
      .select("*, projects(id, name, client_name)")
      .single();

    if (error) throw new Error(error.message);

    return toTimeEntry(data as TimeEntryRow);
  }

  async update(id: string, input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: TimeEntryStatus;
  }) {
    const { data, error } = await supabase
      .from("time_entries")
      .update({
        project_id: input.projectId,
        task: input.task,
        date: input.date,
        duration_minutes: input.durationMinutes,
        status: input.status,
      })
      .eq("id", id)
      .select("*, projects(id, name, client_name)")
      .single();

    if (error) throw new Error(error.message);

    return toTimeEntry(data as TimeEntryRow);
  }

  async remove(id: string) {
    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
