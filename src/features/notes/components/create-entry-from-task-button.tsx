"use client";

import { useState } from "react";
import { Button, Dialog, Skeleton, useDialog } from "@/shared/ui";
import { TimeEntryForm } from "@/features/time-entries/components/create-time-entry-form";
import type { Project, TimeEntry } from "@/features/time-entries/types";

type CreateEntryFromTaskButtonProps = {
  projectId: string;
  taskTitle: string;
  onCreated: (entry: TimeEntry) => void;
};

export function CreateEntryFromTaskButton({ projectId, taskTitle, onCreated }: CreateEntryFromTaskButtonProps) {
  const [projects, setProjects] = useState<Project[] | null>(null);

  async function handleOpen() {
    if (!projects) {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    }
  }

  return (
    <Dialog.Root onOpen={handleOpen}>
      <Dialog.Trigger>
        <Button type="button" variant="outline" size="sm">
          Criar lançamento
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby="dialog-new-entry-from-task-title">
        <Dialog.Header>
          <Dialog.Title id="dialog-new-entry-from-task-title">Novo lançamento</Dialog.Title>
        </Dialog.Header>

        <DialogBody projects={projects} projectId={projectId} taskTitle={taskTitle} onCreated={onCreated} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DialogBody({
  projects,
  projectId,
  taskTitle,
  onCreated,
}: {
  projects: Project[] | null;
  projectId: string;
  taskTitle: string;
  onCreated: (entry: TimeEntry) => void;
}) {
  const { close, openCount } = useDialog();

  if (!projects) {
    return (
      <div className="flex flex-col gap-6 px-10 py-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  return (
    <TimeEntryForm
      key={openCount}
      projects={projects}
      initialValues={{ projectId, task: taskTitle }}
      onSuccess={(entry) => {
        close();
        onCreated(entry);
      }}
      onCancel={close}
    />
  );
}
