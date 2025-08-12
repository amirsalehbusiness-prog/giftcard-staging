import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl transition focus:outline-none";
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    solid: "bg-[#0095da] text-white hover:opacity-90",
    outline: "border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50",
    ghost: "text-neutral-600 hover:bg-neutral-100",
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}