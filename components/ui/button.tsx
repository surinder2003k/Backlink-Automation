import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg disabled:pointer-events-none disabled:opacity-50 hover:outline outline-2 outline-offset-2 outline-cyber-cyan/0 hover:outline-cyber-cyan/60 [transition-delay:600ms] hover:[transition-delay:0ms]",
  {
    variants: {
      variant: {
        default: "bg-cyber-red text-white hover:bg-cyber-red/90 shadow-lg shadow-cyber-red/20",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-cyber-border bg-transparent text-cyber-text hover:bg-cyber-card-hover",
        secondary: "bg-cyber-card text-cyber-text hover:bg-cyber-card-hover border border-cyber-border",
        ghost: "text-cyber-text hover:bg-cyber-card-hover",
        link: "text-cyber-cyan underline-offset-4 hover:underline",
        cyan: "bg-cyber-cyan text-black hover:bg-cyber-cyan/90 shadow-lg shadow-cyber-cyan/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
