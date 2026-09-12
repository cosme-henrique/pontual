import { Sidebar } from "@/shared/ui/sidebar";
import { SidebarNavigation } from "./sidebar-navigation";
import type { Project } from "@/features/projects/types";

type AppSidebarProps = {
  projects: Project[];
  selectedMonth: string;
  monthlyRate: number | null;
};

export function AppSidebar({ projects, selectedMonth, monthlyRate }: AppSidebarProps) {
  return (
    <Sidebar.Root className="hidden md:flex">
      <SidebarNavigation projects={projects} selectedMonth={selectedMonth} monthlyRate={monthlyRate} />
    </Sidebar.Root>
  );
}
