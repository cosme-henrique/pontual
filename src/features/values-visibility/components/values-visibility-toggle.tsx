"use client";

import { Eye, EyeOff } from "lucide-react";
import { useValuesVisibility } from "./values-visibility-context";

export function ValuesVisibilityToggle() {
  const { isVisible, toggle } = useValuesVisibility();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isVisible ? "Ocultar valores" : "Mostrar valores"}
      aria-pressed={isVisible}
      className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2"
    >
      {isVisible ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
    </button>
  );
}
