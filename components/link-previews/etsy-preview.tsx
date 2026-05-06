import { ExternalLink, Store } from "lucide-react";

import { Button } from "@/components/ui/button";

type EtsyPreviewProps = {
  url: string | null;
  compact?: boolean;
};

function getDisplayUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.hostname.replace(/^www\./, "")}${parsedUrl.pathname}`;
  } catch {
    return url;
  }
}

export function EtsyPreview({ url, compact = false }: EtsyPreviewProps) {
  if (!url) return null;

  const displayUrl = getDisplayUrl(url);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card shadow-sm">
      <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-background px-5 py-4 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-background">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-foreground p-2 text-background shadow-sm">
            <Store className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Etsy listing
            </p>
            <p className="text-sm font-semibold text-foreground sm:text-base">
              View the full product page and listing images on Etsy.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {!compact ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Etsy blocks reliable server-side preview images here, so this link opens the original listing directly.
          </p>
        ) : null}
        <Button asChild className="w-full rounded-full sm:w-auto">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on Etsy
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <p className="break-all text-xs text-muted-foreground">{displayUrl}</p>
      </div>
    </div>
  );
}