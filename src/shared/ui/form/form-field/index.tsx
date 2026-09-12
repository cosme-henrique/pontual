"use client";

import { cloneElement, useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/cn";
import { Label } from "../../label";

type FormFieldProps = {
  name: string;
  label?: string;
  children: React.ReactElement;
  className?: string;
};

export function FormField({ name, label, children, className }: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];
  const uid = useId();
  const id = `field-${uid}`;
  const messageId = `${id}-message`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={id} error={!!fieldError}>
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            ...field,
            id,
            "aria-describedby": fieldError ? messageId : undefined,
            "aria-invalid": !!fieldError || undefined,
            error: !!fieldError,
          })
        }
      />
      {fieldError && (
        <p id={messageId} role="alert" className="text-sm text-red-600">
          {String(fieldError.message)}
        </p>
      )}
    </div>
  );
}
