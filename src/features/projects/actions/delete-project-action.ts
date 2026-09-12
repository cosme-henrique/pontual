"use server";

import { revalidatePath } from "next/cache";
import { deleteProject } from "../use-cases/delete-project";
import { makeProjectRepository } from "../repositories/make-project-repository";

type ActionResult = { success: true } | { success: false; error: string };

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const repository = makeProjectRepository();
  await deleteProject(repository, id);

  revalidatePath("/projetos");
  return { success: true };
}
