"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Dialog, useDialog } from "@/shared/ui";
import { deleteNoteAction } from "../actions/delete-note-action";
import { NoteForm } from "./note-form";
import type { Note } from "../types";

type NoteActionsProps = {
  note: Note;
};

export function NoteActions({ note }: NoteActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <EditNoteButton note={note} />
      <DeleteNoteButton note={note} />
    </div>
  );
}

function EditNoteButton({ note }: { note: Note }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" size="icon" aria-label="Editar anotação">
          <Pencil size={15} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby={`edit-note-${note.id}`} className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id={`edit-note-${note.id}`}>Editar anotação</Dialog.Title>
        </Dialog.Header>
        <EditNoteForm note={note} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function EditNoteForm({ note }: { note: Note }) {
  const { close, openCount } = useDialog();
  const router = useRouter();

  function handleSuccess() {
    close();
    router.refresh();
  }

  return (
    <NoteForm
      key={openCount}
      projectId={note.projectId}
      note={note}
      onSuccess={handleSuccess}
      onCancel={close}
    />
  );
}

function DeleteNoteButton({ note }: { note: Note }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    await deleteNoteAction(note.id, note.projectId);
    router.refresh();
    setIsDeleting(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" size="icon" aria-label="Excluir anotação">
          <Trash2 size={15} className="text-red-600" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby={`delete-note-${note.id}`} className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id={`delete-note-${note.id}`}>Excluir anotação?</Dialog.Title>
        </Dialog.Header>
        <div className="px-8 py-6">
          <p className="text-base text-zinc-600">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-zinc-700">{note.title}</span>? Esta ação não poderá ser desfeita.
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
        {isDeleting ? "Excluindo..." : "Excluir"}
      </Button>
    </>
  );
}
