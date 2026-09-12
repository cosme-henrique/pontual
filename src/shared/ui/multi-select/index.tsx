"use client";

import { useState, useRef, useId, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "../button";
import { Badge } from "../badge";
import { Checkbox } from "../checkbox";

export type MultiSelectOption = { value: string; label: string };

export type MultiSelectProps = {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
};

export function MultiSelect({ label, options, selectedValues, onChange, className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  function close() {
    setIsOpen(false);
  }

  function toggleOption(value: string) {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];
    onChange(nextValues);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
        className={cn(isOpen && "border-zinc-700 ring-2 ring-zinc-700 ring-offset-2")}
      >
        {label}
        {selectedValues.length > 0 && <Badge>{selectedValues.length}</Badge>}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn("shrink-0 text-zinc-400 transition-transform duration-150", isOpen && "rotate-180")}
        />
      </Button>

      {isOpen && (
        <div
          id={panelId}
          role="group"
          aria-label={`Filtrar por ${label}`}
          className="absolute z-50 mt-1 min-w-48 rounded-md border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm whitespace-nowrap text-zinc-700 hover:bg-zinc-50">
                  <Checkbox
                    value={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                  />
                  {option.label}
                </label>
              </li>
            ))}
          </ul>

          {selectedValues.length > 0 && (
            <>
              <div className="my-1 border-t border-zinc-100" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="w-full justify-start px-3 text-zinc-500 hover:text-zinc-700"
              >
                Limpar
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
