"use client";

import { createContext, useContext } from "react";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within Tabs.Root");
  return context;
}
