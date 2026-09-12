"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { setValuesVisibilityAction } from "../actions/set-values-visibility-action";

type ValuesVisibilityContextValue = {
  isVisible: boolean;
  toggle: () => void;
};

const ValuesVisibilityContext = createContext<ValuesVisibilityContextValue | null>(null);

type ValuesVisibilityProviderProps = {
  initialVisible: boolean;
  children: React.ReactNode;
};

export function ValuesVisibilityProvider({ initialVisible, children }: ValuesVisibilityProviderProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !isVisible;
    setIsVisible(next);
    startTransition(() => {
      setValuesVisibilityAction(next);
    });
  }

  return <ValuesVisibilityContext value={{ isVisible, toggle }}>{children}</ValuesVisibilityContext>;
}

export function useValuesVisibility() {
  const context = useContext(ValuesVisibilityContext);
  // Fora do Provider, mostra os valores normalmente (ex: StatCard na página de projeto).
  return context ?? { isVisible: true, toggle: () => {} };
}
