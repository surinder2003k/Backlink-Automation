import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-cyber-card text-cyber-text",
        pending: "border-cyber-orange/30 bg-cyber-orange/10 text-cyber-orange",
        published: "border-green-500/30 bg-green-500/10 text-green-400",
        failed: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red",
        success: "border-green-500/30 bg-green-500/10 text-green-400",
        outline: "text-cyber-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
