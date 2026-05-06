import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroBubbleProps = {
  badge: ReactNode;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  layoutClassName?: string;
};

export function HeroBubble({
  badge,
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
  contentClassName,
  textClassName,
  titleClassName,
  descriptionClassName,
  layoutClassName,
}: HeroBubbleProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_hsl(var(--chart-2)/0.16),_transparent_30%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.6))] p-8 shadow-sm sm:p-10",
        className,
      )}
    >
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_hsl(var(--foreground)/0.08),_transparent_58%)] lg:block" />
      <div
        className={cn(
          "relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between",
          layoutClassName,
        )}
      >
        <div className={cn("max-w-3xl space-y-6", contentClassName)}>
          {badge}
          <div className={cn("space-y-4", textClassName)}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              {eyebrow}
            </p>
            <div
              className={cn(
                "max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl",
                titleClassName,
              )}
            >
              {title}
            </div>
            <div
              className={cn(
                "max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base",
                descriptionClassName,
              )}
            >
              {description}
            </div>
          </div>
          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions}
            </div>
          ) : null}
        </div>

        {aside}
      </div>
    </div>
  );
}
