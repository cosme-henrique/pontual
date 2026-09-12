"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button, ColumnConfig, DataTable, Dialog, useDialog } from "@/shared/ui";
import { deleteProjectAction } from "../actions/delete-project-action";
import { ProjectForm } from "./project-form";
import type { Project } from "../types";

type ProjectsTableProps = {
  data: Project[];
};

export function ProjectsTable({ data }: ProjectsTableProps) {
  const router = useRouter();

  const columns: ColumnConfig<Project>[] = [
    { key: "name", label: "Nome", sortable: true },
    {
      key: "clientName",
      label: "Cliente",
      render: (value) => (value as string | undefined) ?? "—",
    },
    {
      key: "id",
      label: "",
      align: "right",
      render: (_value, row) => (
        <RowActions project={row} onMutate={() => router.refresh()} />
      ),
    },
  ];

  return (
    <DataTable.Root data={data} columns={columns}>
      <DataTable.Content />
    </DataTable.Root>
  );
}

function RowActions({ project, onMutate }: { project: Project; onMutate: () => void }) {
  return (
    <Dialog.Root>
      <div className="flex items-center justify-end gap-1">
        <EditButton project={project} onMutate={onMutate} />
        <DeleteButton project={project} onMutate={onMutate} />
      </div>
    </Dialog.Root>
  );
}

function EditButton({ project, onMutate }: { project: Project; onMutate: () => void }) {
  const { open, close, openCount } = useDialog();

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Editar projeto" onClick={open}>
        <Pencil size={15} />
      </Button>

      <Dialog.Content aria-labelledby={`edit-project-${project.id}`}>
        <Dialog.Header>
          <Dialog.Title id={`edit-project-${project.id}`}>Editar projeto</Dialog.Title>
        </Dialog.Header>
        <ProjectForm
          key={openCount}
          project={project}
          onSuccess={() => { close(); onMutate(); }}
          onCancel={close}
        />
      </Dialog.Content>
    </>
  );
}

function DeleteButton({ project, onMutate }: { project: Project; onMutate: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteProjectAction(project.id);
    onMutate();
    setIsDeleting(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" size="icon" aria-label="Deletar projeto">
          <Trash2 size={15} className="text-red-600" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby={`delete-project-${project.id}`} className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id={`delete-project-${project.id}`}>Deletar projeto</Dialog.Title>
        </Dialog.Header>
        <div className="px-8 py-6">
          <p className="text-base text-zinc-600">
            Tem certeza que deseja deletar{" "}
            <span className="font-semibold text-zinc-700">{project.name}</span>? Esta ação não pode ser desfeita.
          </p>
        </div>
        <Dialog.Footer>
          <DeleteConfirmButtons isDeleting={isDeleting} onDelete={handleDelete} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DeleteConfirmButtons({ isDeleting, onDelete }: { isDeleting: boolean; onDelete: () => void }) {
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
