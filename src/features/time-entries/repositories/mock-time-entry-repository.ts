import type { ITimeEntryRepository } from "./ITimeEntryRepository";
import type { Project, TimeEntry, TimeEntryStatus } from "../types";

const PROJECTS: Record<string, Project> = {
  pontual: { id: "p1", name: "Pontual", clientName: "Interno" },
  clienteX: { id: "p2", name: "Cliente X", clientName: "X Corp" },
};

const MOCK: TimeEntry[] = [
  // Hoje (2026-08-28) — done
  { id: "e1", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Implementação do dashboard", date: "2026-08-28", durationMinutes: 180, status: "done", createdAt: "2026-08-28T09:00:00Z" },
  { id: "e2", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Criação dos componentes UI", date: "2026-08-28", durationMinutes: 120, status: "done", createdAt: "2026-08-28T13:00:00Z" },

  // Esta semana (2026-08-24 a 2026-08-27) — done
  { id: "e3", userId: "u1", projectId: "p2", project: PROJECTS.clienteX, task: "Reunião de alinhamento", date: "2026-08-27", durationMinutes: 60, status: "done", createdAt: "2026-08-27T10:00:00Z" },
  { id: "e4", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Code review", date: "2026-08-26", durationMinutes: 90, status: "done", createdAt: "2026-08-26T14:00:00Z" },
  { id: "e5", userId: "u1", projectId: "p2", project: PROJECTS.clienteX, task: "Desenvolvimento de API", date: "2026-08-25", durationMinutes: 240, status: "done", createdAt: "2026-08-25T09:00:00Z" },

  // Resto do mês — done
  { id: "e6", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Configuração do banco de dados", date: "2026-08-20", durationMinutes: 120, status: "done", createdAt: "2026-08-20T10:00:00Z" },
  { id: "e7", userId: "u1", projectId: "p2", project: PROJECTS.clienteX, task: "Testes de integração", date: "2026-08-18", durationMinutes: 150, status: "done", createdAt: "2026-08-18T11:00:00Z" },
  { id: "e8", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Setup do projeto", date: "2026-08-15", durationMinutes: 180, status: "done", createdAt: "2026-08-15T09:00:00Z" },

  // Pendente
  { id: "e9", userId: "u1", projectId: "p2", project: PROJECTS.clienteX, task: "Documentação da API", date: "2026-08-28", durationMinutes: 60, status: "pending", createdAt: "2026-08-28T15:00:00Z" },
  { id: "e10", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Deploy em produção", date: "2026-08-27", durationMinutes: 90, status: "pending", createdAt: "2026-08-27T16:00:00Z" },

  // Backlog
  { id: "e11", userId: "u1", projectId: "p1", project: PROJECTS.pontual, task: "Refatoração do módulo de auth", date: "2026-08-28", durationMinutes: 120, status: "backlog", createdAt: "2026-08-28T08:00:00Z" },
  { id: "e12", userId: "u1", projectId: "p2", project: PROJECTS.clienteX, task: "Otimização de queries", date: "2026-08-22", durationMinutes: 180, status: "backlog", createdAt: "2026-08-22T10:00:00Z" },
];

export class MockTimeEntryRepository implements ITimeEntryRepository {
  async findMany({ search, page, pageSize, month, projectId, status }: {
    search?: string;
    page: number;
    pageSize: number;
    month: string;
    projectId?: string;
    status?: TimeEntryStatus[];
  }) {
    let entries = MOCK.filter((entry) => entry.date === null || entry.date.startsWith(month));

    if (search) {
      const query = search.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.task.toLowerCase().includes(query) ||
          entry.project.name.toLowerCase().includes(query),
      );
    }

    if (projectId) {
      entries = entries.filter((entry) => entry.projectId === projectId);
    }

    if (status && status.length > 0) {
      entries = entries.filter((entry) => status.includes(entry.status));
    }

    const totalCount = entries.length;
    const paginated = entries.slice((page - 1) * pageSize, page * pageSize);

    return { entries: paginated, totalCount };
  }

  async findByMonth(month: string) {
    return MOCK.filter((entry) => entry.date !== null && entry.date.startsWith(month));
  }

  async findById(id: string) {
    return MOCK.find((entry) => entry.id === id) ?? null;
  }

  async getProjects() {
    return Object.values(PROJECTS);
  }

  async create(input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: import("../types").TimeEntryStatus;
  }) {
    const project = Object.values(PROJECTS).find((project) => project.id === input.projectId);
    if (!project) throw new Error(`Project not found: ${input.projectId}`);

    const newEntry: TimeEntry = {
      id: `e${MOCK.length + 1}`,
      userId: "u1",
      projectId: input.projectId,
      project,
      task: input.task,
      date: input.date,
      durationMinutes: input.durationMinutes,
      status: input.status,
      createdAt: new Date().toISOString(),
    };

    MOCK.push(newEntry);
    return newEntry;
  }

  async update(id: string, input: {
    projectId: string;
    task: string;
    date: string | null;
    durationMinutes: number;
    status: import("../types").TimeEntryStatus;
  }) {
    const index = MOCK.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error(`Entry not found: ${id}`);

    const project = Object.values(PROJECTS).find((project) => project.id === input.projectId);
    if (!project) throw new Error(`Project not found: ${input.projectId}`);

    const updated: TimeEntry = { ...MOCK[index], ...input, project };
    MOCK[index] = updated;
    return updated;
  }

  async remove(id: string) {
    const index = MOCK.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error(`Entry not found: ${id}`);
    MOCK.splice(index, 1);
  }
}
