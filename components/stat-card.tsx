import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold leading-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
