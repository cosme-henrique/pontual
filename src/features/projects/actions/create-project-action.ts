"use server";

import { revalidatePath } from "next/cache";
import { projectSchema } from "../schemas/project-schema";
import { createProject } from "../use-cases/create-project";
import { makeProjectRepository } from "../repositories/make-project-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function createProjectAction(
  formData: Record<string, unknown>,
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const repository = makeProjectRepository();
  await createProject(repository, parsed.data);

  revalidatePath("/projetos");
  return { success: true };
}
