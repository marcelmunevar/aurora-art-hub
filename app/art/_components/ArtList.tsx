import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublicArt, getPrivateArt } from "@/lib/queries/art";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";
import { LinkPreview } from "@/components/link-preview";
import type { PublicArt } from "@/types/art";

const CARD_ACCENTS = [
  "from-amber-200/70 via-orange-100/40 to-transparent dark:from-amber-500/20 dark:via-orange-400/10 dark:to-transparent",
  "from-emerald-200/70 via-teal-100/40 to-transparent dark:from-emerald-500/20 dark:via-teal-400/10 dark:to-transparent",
  "from-sky-200/70 via-cyan-100/40 to-transparent dark:from-sky-500/20 dark:via-cyan-400/10 dark:to-transparent",
  "from-rose-200/70 via-pink-100/40 to-transparent dark:from-rose-500/20 dark:via-pink-400/10 dark:to-transparent",
];

type ArtworkCardArtist = {
  name: string | null;
  slug: string | null;
};

type ArtworkCardArt = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  is_public: boolean;
  instagram_url?: string | null;
  artist?: ArtworkCardArtist | null;
};

function getArtistInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "AU";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function ArtworkCard({
  art,
  isOwner,
  hideArtist = false,
  hideOwnerBadge = false,
}: {
  art: ArtworkCardArt;
  isOwner: boolean;
  hideArtist?: boolean;
  hideOwnerBadge?: boolean;
}) {
  const artistInitials = getArtistInitials(art.artist?.name);
  const artistName = art.artist?.name ?? "Unknown artist";
  const accentClass = CARD_ACCENTS[art.id % CARD_ACCENTS.length];

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="relative gap-5 px-0 pb-4 pt-0">
        <div className={`bg-gradient-to-br ${accentClass} px-6 py-6`}>
          <div className="flex items-start gap-4">
            {!hideArtist ? (
              art.artist?.slug ? (
                <Link
                  href={`/artist/${art.artist.slug}`}
                  title={artistName}
                  aria-label={`View ${artistName} profile`}
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-background/80 bg-background/90 text-lg font-semibold text-foreground shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:border-foreground/20"
                >
                  <div className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,_hsl(var(--foreground)/0.06),_transparent_70%)]" />
                  <span className="relative">{artistInitials}</span>
                </Link>
              ) : (
                <div
                  title={artistName}
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-background/80 bg-background/90 text-lg font-semibold text-foreground shadow-sm"
                >
                  <div className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,_hsl(var(--foreground)/0.06),_transparent_70%)]" />
                  <span className="relative">{artistInitials}</span>
                </div>
              )
            ) : null}
            <div className="min-w-0 space-y-3">
              <div className="space-y-2">
                <CardTitle className="text-xl leading-tight">
                  <Link
                    href={`/art/${art.slug}`}
                    className="transition-colors hover:text-foreground/70"
                  >
                    {art.title}
                  </Link>
                </CardTitle>
                {!hideArtist ? (
                  art.artist?.slug ? (
                    <Link
                      href={`/artist/${art.artist.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>{artistName}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <span>{artistName}</span>
                    </div>
                  )
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full px-3 py-1"
                >
                  {art.is_public ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {art.is_public ? "Public" : "Private"}
                </Badge>
                {isOwner && !hideOwnerBadge ? (
                  <Badge className="rounded-full border-transparent bg-foreground text-background">
                    Owner
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="px-6 line-clamp-4 text-sm leading-7 text-muted-foreground/95">
          {art.description?.trim() ||
            "This artwork does not have a description yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 text-sm text-muted-foreground">
        {art.instagram_url ? (
          <Suspense
            fallback={
              <div className="aspect-square w-full max-w-sm animate-pulse rounded-[1.25rem] bg-muted" />
            }
          >
            <div className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-background">
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Instagram preview
              </div>
              <div className="p-3">
                <LinkPreview url={art.instagram_url} />
              </div>
            </div>
          </Suspense>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <Button asChild className="w-full min-w-0 rounded-full md:flex-1">
          <Link href={`/art/${art.slug}`}>
            View artwork
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        {isOwner ? (
          <Button
            asChild
            variant="outline"
            className="w-full min-w-0 rounded-full md:flex-1"
          >
            <Link href={`/art/${art.slug}/edit`}>
              Edit artwork
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export function ArtworkEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="rounded-[1.75rem] border-dashed border-border/70 bg-muted/20">
      <CardHeader className="items-start gap-4">
        <div className="rounded-2xl border border-border/60 bg-background/90 p-3">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      {actionHref && actionLabel ? (
        <CardContent>
          <Button asChild className="rounded-full">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}

type ArtListProps = {
  type: "public" | "private";
};

export async function ArtList({ type }: ArtListProps) {
  let currentUserArtistId: number | null = null;
  let isAuthenticated = true;

  try {
    const currentUserArtist = await getCurrentUserArtist();
    currentUserArtistId = currentUserArtist?.id ?? null;
  } catch (error) {
    if (!(error instanceof QueryError) || error.code !== "UNAUTHORIZED") {
      throw error;
    }

    isAuthenticated = false;
  }

  const artworks =
    type === "public" ? await getPublicArt() : await getPrivateArt();

  const emptyTitle =
    type === "public" ? "No public artwork yet" : "No private artwork yet";
  const emptyDescription =
    type === "public"
      ? "Artwork marked as public will appear here."
      : "Artwork you keep private will appear here.";

  if (artworks.length === 0 && !isAuthenticated) {
    return (
      <ArtworkEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid gap-5 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
      {artworks.length === 0 ? (
        <ArtworkEmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}

      {artworks.map((art) => {
        const isOwner = currentUserArtistId === art.artist_id;
        return <ArtworkCard key={art.id} art={art} isOwner={isOwner} />;
      })}

      {type === "public" && isAuthenticated ? (
        <Card className="flex h-full min-h-72 items-center justify-center overflow-hidden rounded-[1.75rem] border-dashed border-border/70 bg-[radial-gradient(circle_at_top,_hsl(var(--foreground)/0.08),_transparent_55%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.55))] p-6">
          <CardContent className="flex w-full flex-col items-start justify-center gap-5 p-0">
            <div className="rounded-2xl border border-border/60 bg-background/90 p-3 shadow-sm">
              <Plus className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                Add a new piece
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Publish a finished work to the gallery or keep it private until
                it is ready.
              </p>
            </div>
            <Button asChild className="w-full rounded-full sm:w-auto">
              <Link href="/art/add">
                Add artwork
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
