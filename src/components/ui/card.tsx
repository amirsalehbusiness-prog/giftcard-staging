import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white border border-neutral-200 rounded-2xl", className)} {...props} />;
}
export function CardHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-5", className)} {...p}/> }
export function CardContent({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-5 pt-0", className)} {...p}/> }
export function CardFooter({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-5 pt-0", className)} {...p}/> }
export function CardTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn("text-lg font-bold", className)} {...p}/> }
export function CardDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("text-sm text-neutral-500", className)} {...p}/> }