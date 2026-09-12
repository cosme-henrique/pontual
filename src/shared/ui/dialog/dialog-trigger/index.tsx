"use client";

import { cloneElement } from "react";
import { useDialog } from "../use-dialog";

type DialogTriggerProps = {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

export function DialogTrigger({ children }: DialogTriggerProps) {
  const { open } = useDialog();
  return cloneElement(children, { onClick: open });
}
