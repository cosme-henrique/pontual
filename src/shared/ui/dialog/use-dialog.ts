"use client";

import { createContext, useContext } from "react";

type DialogContextValue = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  openCount: number;
  open: () => void;
  close: () => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within Dialog.Root");
  return context;
}
