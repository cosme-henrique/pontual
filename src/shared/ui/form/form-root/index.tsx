"use client";

import { FormProvider, type UseFormReturn, type FieldValues } from "react-hook-form";

type FormRootProps<TValues extends FieldValues, TTransformed extends FieldValues = TValues> = {
  form: UseFormReturn<TValues, unknown, TTransformed>;
  onSubmit: (data: TTransformed) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
};

export function FormRoot<TValues extends FieldValues, TTransformed extends FieldValues = TValues>({
  form,
  onSubmit,
  children,
  className,
}: FormRootProps<TValues, TTransformed>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
