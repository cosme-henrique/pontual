"use client";

import { useRouter } from "next/navigation";
import { Button, Dialog, useDialog } from "@/shared/ui";
import { NoteForm } from "./note-form";

type NewNoteButtonProps = {
  projectId: string;
};

export function NewNoteButton({ projectId }: NewNoteButtonProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="primary" aria-label="Nova anotação">
          <span aria-hidden="true">+</span>
          <span className="hidden md:inline">Nova anotação</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby="dialog-new-note-title" className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id="dialog-new-note-title">Nova anotação</Dialog.Title>
        </Dialog.Header>
        <NewNoteForm projectId={projectId} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function NewNoteForm({ projectId }: { projectId: string }) {
  const { close, openCount } = useDialog();
  const router = useRouter();

  function handleSuccess() {
    close();
    router.refresh();
  }

  return <NoteForm key={openCount} projectId={projectId} onSuccess={handleSuccess} onCancel={close} />;
}
