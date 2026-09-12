"use client";

import { cloneElement } from "react";
import { useDialog } from "../use-dialog";

type DialogCloseProps = {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

export function DialogClose({ children }: DialogCloseProps) {
  const { close } = useDialog();
  return cloneElement(children, { onClick: close });
}
