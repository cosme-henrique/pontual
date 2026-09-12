import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-zinc-700 text-white enabled:hover:bg-zinc-600",
      secondary: "bg-zinc-100 text-zinc-700 enabled:hover:bg-zinc-200",
      outline: "border border-zinc-200 bg-transparent text-zinc-700 enabled:hover:bg-zinc-50",
      ghost: "text-zinc-700 enabled:hover:bg-zinc-100",
      destructive: "bg-red-600 text-white enabled:hover:bg-red-700",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}

export { button as buttonVariants };
export type { ButtonProps };
