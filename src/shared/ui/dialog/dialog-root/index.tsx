"use client";

import { useRef, useState } from "react";
import { DialogContext } from "../use-dialog";

type DialogRootProps = {
  children: React.ReactNode;
  onOpen?: () => void;
};

export function DialogRoot({ children, onOpen }: DialogRootProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openCount, setOpenCount] = useState(0);

  function open() {
    setOpenCount((prev) => prev + 1);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    onOpen?.();
  }

  function close() {
    dialogRef.current?.close();
    document.body.style.overflow = "";
  }

  return (
    <DialogContext value={{ dialogRef, openCount, open, close }}>
      {children}
    </DialogContext>
  );
}
