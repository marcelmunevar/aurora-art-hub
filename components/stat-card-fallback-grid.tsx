import { cn } from "@/lib/utils";

type StatCardFallbackGridProps = {
  count?: number;
  className?: string;
};

export function StatCardFallbackGrid({
  count = 3,
  className,
}: StatCardFallbackGridProps) {
  return (
    <div
      className={cn("grid gap-3 md:min-w-[28rem] md:grid-cols-2", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur",
            index === 2 ? "md:col-span-2" : undefined,
          )}
        >
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-28 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
