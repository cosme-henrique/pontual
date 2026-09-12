"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, FolderKanban, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Sidebar, sidebarMenuButtonClass } from "@/shared/ui/sidebar";
import { MonthFilterSelect } from "@/features/month-filter/components/month-filter-select";
import { MonthlyRateInput } from "@/features/monthly-rates/components/monthly-rate-input";
import { cn } from "@/shared/lib/cn";
import type { Project } from "@/features/projects/types";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} aria-hidden="true" />,
  },
  {
    href: "/lancamentos",
    label: "Lançamentos",
    icon: <Clock size={16} aria-hidden="true" />,
  },
];

type SidebarNavigationProps = {
  projects: Project[];
  selectedMonth: string;
  monthlyRate: number | null;
  onNavigate?: () => void;
};

export function SidebarNavigation({ projects, selectedMonth, monthlyRate, onNavigate }: SidebarNavigationProps) {
  const pathname = usePathname();
  const isProjectsActive = pathname.startsWith("/projetos");
  const [projectsOpen, setProjectsOpen] = useState(isProjectsActive);

  return (
    <>
      <Sidebar.Header>
        <div className="mt-6 md:mt-0">
          <MonthFilterSelect selectedMonth={selectedMonth} />
        </div>
        <MonthlyRateInput key={selectedMonth} selectedMonth={selectedMonth} initialRate={monthlyRate} />
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.Menu>
            {NAV_ITEMS.map((item) => (
              <Sidebar.MenuItem key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={sidebarMenuButtonClass(pathname === item.href)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </Sidebar.MenuItem>
            ))}

            <Sidebar.MenuItem>
              <button
                type="button"
                onClick={() => setProjectsOpen((prev) => !prev)}
                className={cn(
                  sidebarMenuButtonClass(isProjectsActive),
                  "w-full cursor-pointer justify-between",
                )}
              >
                <span className="flex items-center gap-3">
                  <FolderKanban size={16} aria-hidden="true" />
                  Projetos
                </span>
                {projectsOpen
                  ? <ChevronDown size={14} aria-hidden="true" />
                  : <ChevronRight size={14} aria-hidden="true" />
                }
              </button>

              {projectsOpen && (
                <ul className="mt-0.5 flex flex-col gap-0.5 pl-4">
                  <li>
                    <Link
                      href="/projetos"
                      onClick={onNavigate}
                      className={sidebarMenuButtonClass(pathname === "/projetos")}
                    >
                      <span className="text-xs">Todos os projetos</span>
                    </Link>
                  </li>
                  {projects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projetos/${project.id}`}
                        onClick={onNavigate}
                        className={sidebarMenuButtonClass(pathname === `/projetos/${project.id}`)}
                      >
                        <span className="truncate text-xs">{project.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
    </>
  );
}
