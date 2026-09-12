"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "@/shared/ui";
import { projectSchema, type ProjectInput } from "../schemas/project-schema";
import { createProjectAction } from "../actions/create-project-action";
import { updateProjectAction } from "../actions/update-project-action";
import type { Project } from "../types";

type ProjectFormProps = {
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      clientName: project?.clientName ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleSubmit(data: ProjectInput) {
    const result = isEditing
      ? await updateProjectAction(project.id, data)
      : await createProjectAction(data);

    if (!result.success) {
      form.setError("root", { message: result.error });
      return;
    }

    onSuccess();
  }

  return (
    <Form.Root form={form} onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-6">
      <Form.Field name="name" label="Nome do projeto">
        <Input placeholder="Ex: Site institucional" />
      </Form.Field>

      <Form.Field name="clientName" label="Cliente (opcional)">
        <Input placeholder="Ex: Acme Corp" />
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
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar projeto"}
        </Button>
      </div>
    </Form.Root>
  );
}
