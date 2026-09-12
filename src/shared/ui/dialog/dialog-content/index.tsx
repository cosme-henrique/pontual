"use client";

import { useDialog } from "../use-dialog";
import { cn } from "@/shared/lib/cn";

type DialogContentProps = React.HTMLAttributes<HTMLDialogElement>;

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { dialogRef, close } = useDialog();

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={(event) => { event.preventDefault(); close(); }}
      className={cn(
        "fixed left-1/2 top-1/2 m-0 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-0 text-left shadow-xl backdrop:bg-black/40 sm:w-full",
        className,
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}
