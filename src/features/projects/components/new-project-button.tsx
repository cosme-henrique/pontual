"use client";

import { Button, Dialog, useDialog } from "@/shared/ui";
import { ProjectForm } from "./project-form";

export function NewProjectButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="primary" aria-label="Novo projeto">
          <span aria-hidden="true">+</span>
          <span className="hidden md:inline">Novo projeto</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content aria-labelledby="dialog-new-project-title" className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title id="dialog-new-project-title">Novo projeto</Dialog.Title>
        </Dialog.Header>
        <NewProjectForm />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function NewProjectForm() {
  const { close, openCount } = useDialog();
  return <ProjectForm key={openCount} onSuccess={close} onCancel={close} />;
}
