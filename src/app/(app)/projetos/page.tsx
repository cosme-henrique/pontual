import { makeProjectRepository } from "@/features/projects/repositories/make-project-repository";
import { getProjects } from "@/features/projects/use-cases/get-projects";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { NewProjectButton } from "@/features/projects/components/new-project-button";

export default async function ProjetosPage() {
  const repository = makeProjectRepository();
  const projects = await getProjects(repository);

  return (
    <main className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-700">Projetos</h1>
          <p className="mt-1 text-sm text-zinc-500">{projects.length} projeto{projects.length !== 1 ? "s" : ""} cadastrado{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <NewProjectButton />
      </div>

      <ProjectsTable data={projects} />
    </main>
  );
}
