"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, Skeleton, useDialog } from "@/shared/ui";
import { TimeEntryForm } from "@/features/time-entries/components/create-time-entry-form";
import type { Project, TimeEntry } from "@/features/time-entries/types";

type ViewTimeEntryButtonProps = {
  timeEntryId: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "loaded"; entry: TimeEntry; projects: Project[] };

export function ViewTimeEntryButton({ timeEntryId }: ViewTimeEntryButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  async function handleOpen() {
    setState({ status: "loading" });

    try {
      const [entryResponse, projectsResponse] = await Promise.all([
        fetch(`/api/time-entries/${timeEntryId}`),
        fetch("/api/projects"),
      ]);

      if (entryResponse.status === 404) {
        setState({ status: "not-found" });
        return;
      }

      if (!entryResponse.ok || !projectsResponse.ok) {
        setState({ status: "error" });
        return;
      }

      const entry = await entryResponse.json();
      const projects = await projectsResponse.json();
      setState({ status: "loaded", entry, projects });
    } catch {
      setState({ status: "error" });
    }
  }

  function handleSuccess() {
    router.refresh();
  }

  return (
    <Dialog.Root onOpen={handleOpen}>
      <Dialog.Trigger>
        <Button type="button" variant="outline" size="sm">
          Ver lançamento
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby="dialog-view-entry-title">
        <Dialog.Header>
          <Dialog.Title id="dialog-view-entry-title">Lançamento</Dialog.Title>
        </Dialog.Header>

        <DialogBody state={state} onSuccess={handleSuccess} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DialogBody({ state, onSuccess }: { state: LoadState; onSuccess: () => void }) {
  const { close, openCount } = useDialog();

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-6 px-10 py-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (state.status === "not-found") {
    return <p className="px-8 py-6 text-sm text-zinc-600">O lançamento vinculado não foi encontrado.</p>;
  }

  if (state.status === "error") {
    return (
      <p className="px-8 py-6 text-sm text-red-600">Não foi possível carregar o lançamento. Tente novamente.</p>
    );
  }

  return (
    <TimeEntryForm
      key={openCount}
      projects={state.projects}
      entry={state.entry}
      onSuccess={() => {
        close();
        onSuccess();
      }}
      onCancel={close}
    />
  );
}
