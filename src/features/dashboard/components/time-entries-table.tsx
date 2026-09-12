"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button, ColumnConfig, DataTable, Dialog, MultiSelect, useDialog } from "@/shared/ui";
import { formatDate, formatDuration } from "@/shared/lib/format";
import { parseListParam, serializeListParam } from "@/shared/lib/query-params";
import { deleteTimeEntryAction } from "@/features/time-entries/actions/delete-time-entry-action";
import { TimeEntryForm } from "@/features/time-entries/components/create-time-entry-form";
import { STATUS_BADGE } from "@/features/time-entries/components/status-badge";
import { TIME_ENTRY_STATUS_LABEL } from "@/features/time-entries/exporters/status-label";
import { TIME_ENTRY_STATUSES, type Project, type TimeEntry, type TimeEntryStatus } from "@/features/time-entries/types";

const STATUS_OPTIONS = TIME_ENTRY_STATUSES.map((status) => ({
  value: status,
  label: TIME_ENTRY_STATUS_LABEL[status],
}));

type TimeEntriesTableProps = {
  data: TimeEntry[];
  totalCount: number;
  page: number;
  projects?: Project[];
  showActions?: boolean;
};

export function TimeEntriesTable({ data, totalCount, page, projects = [], showActions = false }: TimeEntriesTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") ?? "";
  const statusFilter = parseListParam(searchParams.get("status"));

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  // Filtros multi-valor (ex: status) resetam a página — evita cair numa página vazia.
  function updateListParam(key: string, values: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    const serialized = serializeListParam(values);
    if (serialized) {
      params.set(key, serialized);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const columns: ColumnConfig<TimeEntry>[] = [
    { key: "task", label: "Tarefa", sortable: true },
    {
      key: "project",
      label: "Projeto",
      render: (value) => (value as Project).name,
    },
    {
      key: "date",
      label: "Data",
      sortable: true,
      render: (value) => formatDate(value as string | null),
    },
    {
      key: "durationMinutes",
      label: "Duração",
      align: "right",
      render: (value) => formatDuration(value as number),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => STATUS_BADGE[value as TimeEntryStatus],
    },
    ...(showActions
      ? [{
          key: "id" as keyof TimeEntry,
          label: "",
          align: "right" as const,
          render: (_value: unknown, row: TimeEntry) => (
            <RowActions entry={row} projects={projects} onMutate={() => router.refresh()} />
          ),
        }]
      : []),
  ];

  return (
    <DataTable.Root
      data={data}
      columns={columns}
      search={search}
      onSearchChange={(value) => updateParam("search", value)}
      searchPlaceholder="Buscar tarefa ou projeto..."
      totalCount={totalCount}
      page={page}
      pageSize={10}
      onPageChange={(nextPage) => updateParam("page", String(nextPage))}
      filters={
        <MultiSelect
          label="Status"
          options={STATUS_OPTIONS}
          selectedValues={statusFilter}
          onChange={(values) => updateListParam("status", values)}
        />
      }
    >
      <DataTable.Toolbar />
      <DataTable.Content />
      <DataTable.Pagination />
    </DataTable.Root>
  );
}

function RowActions({ entry, projects, onMutate }: { entry: TimeEntry; projects: Project[]; onMutate: () => void }) {
  return (
    <Dialog.Root>
      <div className="flex items-center justify-end gap-1">
        <EditButton entry={entry} projects={projects} onMutate={onMutate} />
        <DeleteButton entry={entry} onMutate={onMutate} />
      </div>
    </Dialog.Root>
  );
}

function EditButton({ entry, projects, onMutate }: { entry: TimeEntry; projects: Project[]; onMutate: () => void }) {
  const { open, close, openCount } = useDialog();

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Editar lançamento" onClick={open}>
        <Pencil size={15} />
      </Button>

      <Dialog.Content aria-labelledby={`edit-dialog-${entry.id}`}>
        <Dialog.Header>
          <Dialog.Title id={`edit-dialog-${entry.id}`}>Editar lançamento</Dialog.Title>
        </Dialog.Header>
        <TimeEntryForm
          key={openCount}
          projects={projects}
          entry={entry}
          onSuccess={() => { close(); onMutate(); }}
          onCancel={close}
        />
      </Dialog.Content>
    </>
  );
}

function DeleteButton({ entry, onMutate }: { entry: TimeEntry; onMutate: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteTimeEntryAction(entry.id);
    onMutate();
    setIsDeleting(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" size="icon" aria-label="Deletar lançamento">
          <Trash2 size={15} className="text-red-600" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby={`delete-dialog-${entry.id}`} className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id={`delete-dialog-${entry.id}`}>Deletar lançamento</Dialog.Title>
        </Dialog.Header>
        <div className="px-8 py-6">
          <p className="text-base text-zinc-600">
            Tem certeza que deseja deletar <span className="font-semibold text-zinc-700">{entry.task}</span>? Esta ação não pode ser desfeita.
          </p>
        </div>
        <Dialog.Footer>
          <DeleteConfirmButtons entry={entry} isDeleting={isDeleting} onDelete={handleDelete} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DeleteConfirmButtons({ entry, isDeleting, onDelete }: { entry: TimeEntry; isDeleting: boolean; onDelete: () => void }) {
  const { close } = useDialog();
  return (
    <>
      <Button variant="outline" size="md" onClick={close} disabled={isDeleting}>
        Cancelar
      </Button>
      <Button variant="destructive" size="md" onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Deletando..." : "Deletar"}
      </Button>
    </>
  );
}
