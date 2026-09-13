"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Textarea } from "@/shared/ui";
import { updateNoteSchema, type UpdateNoteInput } from "../schemas/note-schema";
import { createNoteAction } from "../actions/create-note-action";
import { updateNoteAction } from "../actions/update-note-action";
import type { Note } from "../types";

type NoteFormProps = {
  projectId: string;
  note?: Note;
  onSuccess: () => void;
  onCancel: () => void;
};

export function NoteForm({ projectId, note, onSuccess, onCancel }: NoteFormProps) {
  const isEditing = !!note;

  const form = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleSubmit(data: UpdateNoteInput) {
    const result = isEditing
      ? await updateNoteAction(note.id, projectId, data)
      : await createNoteAction({ ...data, projectId });

    if (!result.success) {
      form.setError("root", { message: result.error });
      return;
    }

    onSuccess();
  }

  return (
    <Form.Root form={form} onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-6">
      <Form.Field name="title" label="Título">
        <Input placeholder="Ex: Reunião sobre comunicados" />
      </Form.Field>

      <Form.Field name="content" label="Anotação">
        <Textarea placeholder="Escreva sua anotação..." rows={5} />
      </Form.Field>

      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-red-600">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar"}
        </Button>
      </div>
    </Form.Root>
  );
}
