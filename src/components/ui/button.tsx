import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0F172A] text-white shadow-sm hover:bg-[#1E293B] active:scale-[0.98]",
        gold: "bg-[#C5A880] text-white shadow-sm hover:bg-[#B39369] active:scale-[0.98]",
        accent: "bg-[#C5A880] text-white shadow-sm hover:bg-[#B39369] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[#EAE6DF] bg-white text-[#1E293B] shadow-sm hover:bg-[#F3F0EA] hover:border-[#C5A880] active:scale-[0.98]",
        secondary: "bg-[#F3F0EA] text-[#0F172A] hover:bg-[#EAE6DF] active:scale-[0.98]",
        ghost: "hover:bg-[#F3F0EA] hover:text-[#0F172A]",
        link: "text-[#0F172A] underline-offset-4 hover:underline hover:text-[#C5A880]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
