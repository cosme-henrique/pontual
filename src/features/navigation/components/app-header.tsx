"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/shared/ui/sidebar";
import { SidebarNavigation } from "./sidebar-navigation";
import type { Project } from "@/features/projects/types";

type AppHeaderProps = {
  projects: Project[];
  selectedMonth: string;
  monthlyRate: number | null;
};

export function AppHeader({ projects, selectedMonth, monthlyRate }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header className="relative flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 md:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <span className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-zinc-700 md:static md:left-auto md:translate-x-0">
          Pontual
        </span>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <Sidebar.Root className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <SidebarNavigation
              projects={projects}
              selectedMonth={selectedMonth}
              monthlyRate={monthlyRate}
              onNavigate={() => setIsOpen(false)}
            />
          </Sidebar.Root>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-zinc-900/40"
          />
        </div>
      )}
    </>
  );
}
