import { supabase } from "@/shared/lib/supabase";
import { getMonthEndExclusive } from "@/shared/lib/date";
import type { IProjectRepository } from "./IProjectRepository";
import type { Project, ProjectStats } from "../types";

export class SupabaseProjectRepository implements IProjectRepository {
  async findMany(): Promise<Project[]> {
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

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, client_name")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      name: data.name,
      clientName: data.client_name ?? undefined,
    };
  }

  async getStats(projectId: string, month: string): Promise<ProjectStats> {
    const { data, error } = await supabase
      .from("time_entries")
      .select("duration_minutes, status")
      .eq("project_id", projectId)
      .gte("date", `${month}-01`)
      .lt("date", getMonthEndExclusive(month));

    if (error) throw new Error(error.message);

    const rows = data ?? [];

    return {
      totalMinutes: rows.reduce((sum, row) => sum + row.duration_minutes, 0),
      doneMinutes: rows.filter((row) => row.status === "done").reduce((sum, row) => sum + row.duration_minutes, 0),
      pendingMinutes: rows.filter((row) => row.status === "pending").reduce((sum, row) => sum + row.duration_minutes, 0),
      backlogMinutes: rows.filter((row) => row.status === "backlog").reduce((sum, row) => sum + row.duration_minutes, 0),
      entriesCount: rows.length,
    };
  }

  async create(input: { name: string; clientName?: string }): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert({ name: input.name, client_name: input.clientName ?? null })
      .select("id, name, client_name")
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      clientName: data.client_name ?? undefined,
    };
  }

  async update(id: string, input: { name: string; clientName?: string }): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({ name: input.name, client_name: input.clientName ?? null })
      .eq("id", id)
      .select("id, name, client_name")
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      clientName: data.client_name ?? undefined,
    };
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
