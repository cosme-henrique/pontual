"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { TabsContext } from "../use-tabs";

type TabsRootProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function TabsRoot({ defaultValue, value, onValueChange, className, ...props }: TabsRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value ?? internalValue;

  function setValue(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <TabsContext value={{ value: activeValue, setValue }}>
      <div className={cn("flex flex-col gap-4", className)} {...props} />
    </TabsContext>
  );
}
