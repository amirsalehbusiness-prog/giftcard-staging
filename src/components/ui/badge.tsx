import React from "react";
import { cn } from "../../lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "solid" | "secondary" | "outline";
};

export function Badge({ className, variant = "solid", ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    solid: "bg-[#ff4f00] text-white",
    secondary: "bg-neutral-100 text-neutral-800",
    outline: "border border-neutral-300 text-neutral-700 bg-white",
  };
  return <span className={cn("inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-medium", styles[variant], className)} {...props} />;
}