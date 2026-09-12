"use client";

import { useState } from "react";
import { Button, Dialog, useDialog, Skeleton } from "@/shared/ui";
import { TimeEntryForm } from "@/features/time-entries/components/create-time-entry-form";
import { QuickEntryStep } from "@/features/time-entries/components/quick-entry-step";
import { QuickEntryReviewStep } from "@/features/time-entries/components/quick-entry-review-step";
import { createTimeEntryAction } from "@/features/time-entries/actions/create-time-entry-action";
import type { Project } from "@/features/time-entries/types";
import type { QuickEntryDraft } from "@/features/time-entries/schemas/quick-entry-draft-schema";

export function NewEntryButton() {
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
        <Button variant="primary" aria-label="Novo lançamento">
          <span aria-hidden="true">+</span>
          <span className="hidden md:inline">Novo lançamento</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby="dialog-new-entry-title">
        <Dialog.Header>
          <Dialog.Title id="dialog-new-entry-title">Novo lançamento</Dialog.Title>
        </Dialog.Header>

        <DialogBody projects={projects} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DialogBody({ projects }: { projects: Project[] | null }) {
  const { openCount } = useDialog();

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

  return <NewEntryFlow key={openCount} projects={projects} />;
}

type Step = "quick" | "review" | "full";

function NewEntryFlow({ projects }: { projects: Project[] }) {
  const { close } = useDialog();
  const [step, setStep] = useState<Step>("quick");
  const [rawText, setRawText] = useState("");
  const [draft, setDraft] = useState<QuickEntryDraft | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleConfirm(projectId: string) {
    if (!draft) return;

    setIsSubmitting(true);
    setConfirmError(null);

    const result = await createTimeEntryAction({
      projectId,
      task: draft.task,
      hasNoDate: draft.date === null,
      date: draft.date ?? undefined,
      hours: Math.floor(draft.durationMinutes / 60),
      minutes: draft.durationMinutes % 60,
      status: draft.status,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setConfirmError(result.error);
      return;
    }

    close();
  }

  if (step === "quick") {
    return (
      <QuickEntryStep
        initialText={rawText}
        onGenerated={(text, generatedDraft) => {
          setRawText(text);
          setDraft(generatedDraft);
          setStep("review");
        }}
        onManual={() => setStep("full")}
      />
    );
  }

  if (step === "review" && draft) {
    return (
      <QuickEntryReviewStep
        draft={draft}
        projects={projects}
        isSubmitting={isSubmitting}
        error={confirmError}
        onConfirm={handleConfirm}
        onAdjust={() => setStep("full")}
        onRetry={() => setStep("quick")}
      />
    );
  }

  return (
    <TimeEntryForm
      projects={projects}
      initialValues={
        draft
          ? {
              projectId: draft.projectId ?? undefined,
              task: draft.task,
              date: draft.date,
              durationMinutes: draft.durationMinutes,
              status: draft.status,
            }
          : undefined
      }
      onSuccess={close}
      onCancel={close}
    />
  );
}
