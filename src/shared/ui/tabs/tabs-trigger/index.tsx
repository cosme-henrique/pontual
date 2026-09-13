"use client";

import { tv, type VariantProps } from "tailwind-variants";
import { useTabs } from "../use-tabs";

const tabsTrigger = tv({
  base: "cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2",
  variants: {
    active: {
      true: "border-zinc-700 text-zinc-700",
      false: "border-transparent text-zinc-500 hover:text-zinc-700",
    },
  },
  defaultVariants: {
    active: false,
  },
});

type TabsTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> &
  VariantProps<typeof tabsTrigger> & {
    value: string;
  };

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const { value: activeValue, setValue } = useTabs();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      onClick={() => setValue(value)}
      className={tabsTrigger({ active: isActive, className })}
      {...props}
    />
  );
}
