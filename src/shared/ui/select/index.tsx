"use client";

import { useState, useRef, useId, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  ref?: React.Ref<HTMLButtonElement>;
};

export function Select({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Selecione...",
  error,
  disabled,
  id,
  className,
  ref,
  ...ariaProps
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedOption = options.find((option) => option.value === value);
  const isPlaceholder = !selectedOption;

  function close() {
    setIsOpen(false);
    setFocusedIndex(-1);
    onBlur?.();
  }

  function handleSelect(optionValue: string) {
    onChange?.(optionValue);
    close();
  }

  function handleTriggerClick() {
    if (disabled) return;
    if (isOpen) {
      close();
    } else {
      const currentIndex = options.findIndex((option) => option.value === value);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      setIsOpen(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;

    if (!isOpen) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = options.findIndex((option) => option.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0) handleSelect(options[focusedIndex].value);
        break;
      case "Tab":
        close();
        break;
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={ref}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        disabled={disabled}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-600 focus-visible:ring-red-600" : "border-zinc-200",
          isOpen && "ring-2 ring-zinc-700 ring-offset-2 border-zinc-700",
        )}
        {...ariaProps}
      >
        <span className={cn("truncate", isPlaceholder ? "text-zinc-400" : "text-zinc-700")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn("shrink-0 text-zinc-400 transition-transform duration-150", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm",
                  isSelected
                    ? "bg-zinc-100 text-zinc-700 font-medium"
                    : isFocused
                      ? "bg-zinc-50 text-zinc-700"
                      : "text-zinc-700",
                )}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
