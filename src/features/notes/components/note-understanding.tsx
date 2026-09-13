"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ListChecks, Loader2, Sparkles } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { understandNoteAction } from "../actions/understand-note-action";
import { generateSuggestedTasksAction } from "../actions/generate-suggested-tasks-action";
import { linkSuggestedTaskToTimeEntryAction } from "../actions/link-suggested-task-to-time-entry-action";
import { CreateEntryFromTaskButton } from "./create-entry-from-task-button";
import { ViewTimeEntryButton } from "./view-time-entry-button";
import type { Note } from "../types";
import type { SuggestedTask } from "../schemas/note-suggested-tasks-schema";
import type { TimeEntry } from "@/features/time-entries/types";

type NoteUnderstandingProps = {
  note: Note;
};

export function NoteUnderstandingSection({ note }: NoteUnderstandingProps) {
  const router = useRouter();
  const [understanding, setUnderstanding] = useState(note.aiUnderstanding);
  const [analyzedAt, setAnalyzedAt] = useState(note.aiAnalyzedAt);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [suggestedTasks, setSuggestedTasks] = useState(note.aiSuggestedTasks);
  const [tasksGeneratedAt, setTasksGeneratedAt] = useState(note.aiTasksGeneratedAt);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [isTasksPending, startTasksTransition] = useTransition();

  const isStale = analyzedAt !== null && new Date(note.updatedAt) > new Date(analyzedAt);
  const areTasksStale =
    tasksGeneratedAt !== null && analyzedAt !== null && new Date(analyzedAt) > new Date(tasksGeneratedAt);

  function handleGenerateUnderstanding() {
    setError(null);
    startTransition(async () => {
      const result = await understandNoteAction(note.id, note.projectId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setUnderstanding(result.note.aiUnderstanding);
      setAnalyzedAt(result.note.aiAnalyzedAt);
      router.refresh();
    });
  }

  function handleGenerateTasks() {
    setTasksError(null);
    startTasksTransition(async () => {
      const result = await generateSuggestedTasksAction(note.id, note.projectId);

      if (!result.success) {
        setTasksError(result.error);
        return;
      }

      setSuggestedTasks(result.note.aiSuggestedTasks);
      setTasksGeneratedAt(result.note.aiTasksGeneratedAt);
      router.refresh();
    });
  }

  async function handleTaskCreated(suggestedTaskId: string, entry: TimeEntry) {
    const result = await linkSuggestedTaskToTimeEntryAction(note.id, suggestedTaskId, entry.id, note.projectId);

    if (!result.success) {
      setTasksError(`O lançamento foi criado, mas não foi possível vincular à tarefa sugerida: ${result.error}`);
      return;
    }

    setSuggestedTasks(result.note.aiSuggestedTasks);
    router.refresh();
  }

  if (!understanding) {
    return (
      <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3">
        <GenerateButton icon={Sparkles} isPending={isPending} pendingLabel="Analisando anotação..." onClick={handleGenerateUnderstanding}>
          Entender com IA
        </GenerateButton>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-4">
      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3">
        {isStale && (
          <div className="flex items-center gap-2">
            <Badge variant="warning">Desatualizado</Badge>
            <p className="text-xs text-zinc-500">Esta anotação foi alterada após a última análise.</p>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-md bg-zinc-50 p-3 text-sm">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Entendimento da tarefa</h4>

          {understanding.objective && (
            <UnderstandingBlock label="Objetivo">
              <p className="text-zinc-600">{understanding.objective}</p>
            </UnderstandingBlock>
          )}

          {understanding.identifiedPoints.length > 0 && (
            <UnderstandingBlock label="Pontos identificados">
              <UnderstandingList items={understanding.identifiedPoints} />
            </UnderstandingBlock>
          )}

          {understanding.dependencies.length > 0 && (
            <UnderstandingBlock label="Dependências">
              <UnderstandingList items={understanding.dependencies} />
            </UnderstandingBlock>
          )}

          {understanding.questions.length > 0 && (
            <UnderstandingBlock label="Pontos para confirmar">
              <UnderstandingList items={understanding.questions} />
            </UnderstandingBlock>
          )}
        </div>

        <div>
          <GenerateButton icon={Sparkles} isPending={isPending} pendingLabel="Analisando anotação..." onClick={handleGenerateUnderstanding}>
            Atualizar entendimento
          </GenerateButton>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {suggestedTasks && suggestedTasks.length > 0 ? (
        <SuggestedTasksSection
          projectId={note.projectId}
          tasks={suggestedTasks}
          isStale={areTasksStale}
          isPending={isTasksPending}
          onGenerate={handleGenerateTasks}
          onTaskCreated={handleTaskCreated}
        />
      ) : (
        <div className="border-t border-zinc-100 pt-3">
          <GenerateButton
            icon={ListChecks}
            isPending={isTasksPending}
            pendingLabel="Gerando tarefas..."
            onClick={handleGenerateTasks}
          >
            Dividir em tarefas
          </GenerateButton>
        </div>
      )}

      {tasksError && (
        <p role="alert" className="text-sm text-red-600">
          {tasksError}
        </p>
      )}
    </div>
  );
}

function SuggestedTasksSection({
  projectId,
  tasks,
  isStale,
  isPending,
  onGenerate,
  onTaskCreated,
}: {
  projectId: string;
  tasks: SuggestedTask[];
  isStale: boolean;
  isPending: boolean;
  onGenerate: () => void;
  onTaskCreated: (suggestedTaskId: string, entry: TimeEntry) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3">
      {isStale && (
        <div className="flex items-center gap-2">
          <Badge variant="warning">Desatualizado</Badge>
          <p className="text-xs text-zinc-500">O entendimento foi atualizado após a geração destas tarefas.</p>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-md bg-zinc-50 p-3 text-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tarefas sugeridas</h4>
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-md border border-zinc-200 bg-white px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {task.timeEntryId && <Check size={14} className="shrink-0 text-green-600" aria-hidden="true" />}
                <span className="text-zinc-600">{task.title}</span>
              </div>

              {task.timeEntryId ? (
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="success">Lançamento criado</Badge>
                  <ViewTimeEntryButton timeEntryId={task.timeEntryId} />
                </div>
              ) : (
                <div className="shrink-0">
                  <CreateEntryFromTaskButton
                    projectId={projectId}
                    taskTitle={task.title}
                    onCreated={(entry) => onTaskCreated(task.id, entry)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <GenerateButton icon={ListChecks} isPending={isPending} pendingLabel="Gerando tarefas..." onClick={onGenerate}>
          Atualizar tarefas
        </GenerateButton>
      </div>
    </div>
  );
}

function GenerateButton({
  icon: Icon,
  isPending,
  pendingLabel,
  onClick,
  children,
}: {
  icon: typeof Sparkles;
  isPending: boolean;
  pendingLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          <Icon size={14} aria-hidden="true" />
          {children}
        </>
      )}
    </Button>
  );
}

function UnderstandingBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

function UnderstandingList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-0.5 pl-4 text-zinc-600">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
