"use client";

import { useEffect } from "react";
import { useForm, useController, type Control, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Form, Input, Select } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { createTimeEntrySchema, type CreateTimeEntryInput } from "../schemas/create-time-entry-schema";
import { createTimeEntryAction } from "../actions/create-time-entry-action";
import { updateTimeEntryAction } from "../actions/update-time-entry-action";
import type { TimeEntry, TimeEntryStatus, Project } from "../types";

type RawFormValues = Omit<CreateTimeEntryInput, "hours" | "minutes"> & {
  hours: string | number;
  minutes: string | number;
};

type TimeEntryInitialValues = {
  projectId?: string;
  task?: string;
  date?: string | null;
  durationMinutes?: number;
  status?: TimeEntryStatus;
};

type TimeEntryFormProps = {
  projects: Project[];
  entry?: TimeEntry;
  initialValues?: TimeEntryInitialValues;
  onSuccess: (entry: TimeEntry) => void;
  onCancel: () => void;
};

const STATUS_OPTIONS: { value: TimeEntryStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "pending", label: "Pendente" },
  { value: "done", label: "Concluído" },
];

function StatusToggle({ control, disabled }: { control: Control<RawFormValues>; disabled?: boolean }) {
  const { field } = useController({ name: "status", control });

  return (
    <div
      role="group"
      aria-label="Status"
      className="flex flex-col divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 sm:flex-row sm:divide-x sm:divide-y-0"
    >
      {STATUS_OPTIONS.map((option) => {
        const isActive = field.value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => field.onChange(option.value)}
            className={cn(
              "flex-1 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-zinc-700 font-medium text-white"
                : "cursor-pointer bg-white text-zinc-500 hover:bg-zinc-50",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function TimeEntryForm({ projects, entry, initialValues, onSuccess, onCancel }: TimeEntryFormProps) {
  const isEditing = !!entry;

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.clientName ? `${project.name} — ${project.clientName}` : project.name,
  }));

  const durationMinutes = entry?.durationMinutes ?? initialValues?.durationMinutes;

  const form = useForm<RawFormValues, unknown, CreateTimeEntryInput>({
    resolver: zodResolver(createTimeEntrySchema) as Resolver<RawFormValues, unknown, CreateTimeEntryInput>,
    defaultValues: {
      projectId: entry?.projectId ?? initialValues?.projectId ?? "",
      task: entry?.task ?? initialValues?.task ?? "",
      hasNoDate: entry ? entry.date === null : (initialValues?.date === null),
      date: entry?.date ?? initialValues?.date ?? new Date().toISOString().split("T")[0],
      hours: durationMinutes !== undefined ? Math.floor(durationMinutes / 60) : 0,
      minutes: durationMinutes !== undefined ? durationMinutes % 60 : 0,
      status: entry?.status ?? initialValues?.status ?? "done",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const { field: hasNoDateField } = useController({ name: "hasNoDate", control: form.control });
  const hasNoDate = hasNoDateField.value;

  useEffect(() => {
    if (hasNoDate) {
      form.setValue("status", "backlog");
    }
  }, [hasNoDate, form]);

  async function handleSubmit(data: CreateTimeEntryInput) {
    const result = isEditing
      ? await updateTimeEntryAction(entry.id, data)
      : await createTimeEntryAction(data);

    if (!result.success) {
      form.setError("root", { message: result.error });
      return;
    }

    onSuccess(result.entry);
  }

  return (
    <Form.Root
      form={form}
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 px-10 py-8"
    >
      <Form.Field name="projectId" label="Projeto">
        <Select options={projectOptions} placeholder="Selecione um projeto" />
      </Form.Field>

      <Form.Field name="task" label="Tarefa">
        <Input
          placeholder="Descreva o que foi feito"
          prompt="Corrija a ortografia e a formatação deste texto, deixando-o como um título de tarefa curto e claro, em português."
        />
      </Form.Field>

      <div className="flex flex-col gap-2">
        <Form.Field name="date" label="Data">
          <Input type="date" disabled={hasNoDate} />
        </Form.Field>

        <Form.Field name="hasNoDate" label="Sem data (backlog sem previsão de início)" className="flex-row items-center gap-2">
          <Checkbox />
        </Form.Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Form.Field name="hours" label="Horas" className="sm:flex-1">
          <Input type="number" min={0} max={23} placeholder="0" />
        </Form.Field>
        <Form.Field name="minutes" label="Minutos" className="sm:flex-1">
          <Input type="number" min={0} max={59} step={15} placeholder="0" />
        </Form.Field>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">Status</span>
        <StatusToggle control={form.control} disabled={hasNoDate} />
      </div>

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
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar lançamento"}
        </Button>
      </div>
    </Form.Root>
  );
}

export { TimeEntryForm as CreateTimeEntryForm };
