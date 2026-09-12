"use client";

import { useState } from "react";
import { Button, Select } from "@/shared/ui";
import { formatDate, formatDuration } from "@/shared/lib/format";
import { STATUS_BADGE } from "./status-badge";
import type { Project } from "../types";
import type { QuickEntryDraft } from "../schemas/quick-entry-draft-schema";

type QuickEntryReviewStepProps = {
  draft: QuickEntryDraft;
  projects: Project[];
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: (projectId: string) => void;
  onAdjust: () => void;
  onRetry: () => void;
};

export function QuickEntryReviewStep({
  draft,
  projects,
  isSubmitting,
  error,
  onConfirm,
  onAdjust,
  onRetry,
}: QuickEntryReviewStepProps) {
  const [projectId, setProjectId] = useState(draft.projectId ?? "");

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.clientName ? `${project.name} — ${project.clientName}` : project.name,
  }));

  const selectedProject = projects.find((project) => project.id === projectId);

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-zinc-500">Projeto</span>
          {draft.projectId && selectedProject ? (
            <span className="text-zinc-700">
              {selectedProject.clientName
                ? `${selectedProject.name} — ${selectedProject.clientName}`
                : selectedProject.name}
            </span>
          ) : (
            <Select
              options={projectOptions}
              value={projectId}
              onChange={setProjectId}
              placeholder="Não identifiquei o projeto — selecione um"
              aria-label="Projeto"
              error={!projectId}
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-medium text-zinc-500">Tarefa</span>
          <span className="text-zinc-700">{draft.task}</span>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-zinc-500">Data</span>
            <span className="text-zinc-700">{formatDate(draft.date)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-zinc-500">Duração</span>
            <span className="text-zinc-700">{formatDuration(draft.durationMinutes)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-zinc-500">Status</span>
            {STATUS_BADGE[draft.status]}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            disabled={isSubmitting}
            className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline disabled:opacity-50"
          >
            Tentar de novo
          </button>
          <button
            type="button"
            onClick={onAdjust}
            disabled={isSubmitting}
            className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline disabled:opacity-50"
          >
            Ajustar detalhes
          </button>
        </div>

        <Button type="button" onClick={() => onConfirm(projectId)} disabled={isSubmitting || !projectId}>
          {isSubmitting ? "Salvando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
