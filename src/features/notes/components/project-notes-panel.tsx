import { Card } from "@/shared/ui";
import { makeNoteRepository } from "../repositories/make-note-repository";
import { getNotesByProjectId } from "../use-cases/get-notes-by-project-id";
import { NewNoteButton } from "./new-note-button";
import { NoteActions } from "./note-actions";
import { NoteUnderstandingSection } from "./note-understanding";
import type { Note } from "../types";

type ProjectNotesPanelProps = {
  projectId: string;
};

export async function ProjectNotesPanel({ projectId }: ProjectNotesPanelProps) {
  const repository = makeNoteRepository();
  const notes = await getNotesByProjectId(repository, projectId);

  return (
    <Card.Root>
      <Card.Header className="flex-row items-center justify-between">
        <div>
          <Card.Title>Anotações do projeto</Card.Title>
          <Card.Description>
            Organize aqui suas anotações e entendimentos sobre as tarefas deste projeto.
          </Card.Description>
        </div>
        <NewNoteButton projectId={projectId} />
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        {notes.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhuma anotação criada ainda.</p>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </Card.Content>
    </Card.Root>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold text-zinc-700">{note.title}</h3>
        <span className="shrink-0 text-xs text-zinc-400">
          {new Date(note.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">{note.content}</p>
      <div className="mt-3 flex justify-end">
        <NoteActions note={note} />
      </div>
      <NoteUnderstandingSection note={note} />
    </div>
  );
}
