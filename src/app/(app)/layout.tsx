import { makeProjectRepository } from "@/features/projects/repositories/make-project-repository";
import { getProjects } from "@/features/projects/use-cases/get-projects";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { AppHeader } from "@/features/navigation/components/app-header";
import { makeMonthFilterRepository } from "@/features/month-filter/repositories/make-month-filter-repository";
import { getSelectedMonth } from "@/features/month-filter/use-cases/get-selected-month";
import { makeMonthlyRateRepository } from "@/features/monthly-rates/repositories/make-monthly-rate-repository";
import { getMonthlyRate } from "@/features/monthly-rates/use-cases/get-monthly-rate";
import type { Project } from "@/features/projects/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const projectRepository = makeProjectRepository();
  const monthFilterRepository = makeMonthFilterRepository();
  const monthlyRateRepository = makeMonthlyRateRepository();

  const [projects, selectedMonth]: [Project[], string] = await Promise.all([
    getProjects(projectRepository),
    getSelectedMonth(monthFilterRepository),
  ]);

  const monthlyRate = await getMonthlyRate(monthlyRateRepository, selectedMonth);

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        projects={projects}
        selectedMonth={selectedMonth}
        monthlyRate={monthlyRate?.hourlyRate ?? null}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          projects={projects}
          selectedMonth={selectedMonth}
          monthlyRate={monthlyRate?.hourlyRate ?? null}
        />
        <div className="flex flex-1 flex-col overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
