import { tv, type VariantProps } from "tailwind-variants";

const separator = tv({
  base: "shrink-0 bg-zinc-200",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof separator>;

export function Separator({ orientation, className, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={separator({ orientation, className })}
      {...props}
    />
  );
}
