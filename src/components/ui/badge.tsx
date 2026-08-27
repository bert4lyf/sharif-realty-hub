import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0F172A] text-white shadow-sm",
        gold: "border-[#C5A880]/30 bg-[#C5A880]/15 text-[#B38B59] font-bold uppercase",
        accent: "border-transparent bg-[#C5A880] text-white shadow-sm",
        sand: "border-[#EAE6DF] bg-[#F3F0EA] text-[#0F172A] uppercase",
        exclusive: "border-white/20 bg-[#0F172A]/85 text-white backdrop-blur-md shadow-sm",
        secondary:
          "border-transparent bg-[#F3F0EA] text-[#0F172A] hover:bg-[#EAE6DF]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-[#EAE6DF] text-[#1E293B] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
