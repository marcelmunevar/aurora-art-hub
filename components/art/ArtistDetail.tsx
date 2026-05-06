import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Instagram,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Store,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroBubble } from "@/components/hero-bubble";
import { StatCard } from "@/components/stat-card";
import { ArtworkCard, ArtworkEmptyState } from "@/components/art/ArtList";
import { getArtsByArtistId } from "@/lib/queries/art";
import { getArtistBySlug, getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";

export async function ArtistDetail({ artistSlug }: { artistSlug: string }) {
  const artist = await getArtistBySlug(artistSlug);

  if (!artist) notFound();

  let currentArtistId: number | null = null;

  await (async () => {
    try {
      const currentArtist = await getCurrentUserArtist();
      currentArtistId = currentArtist?.id ?? null;
    } catch (error) {
      if (!(error instanceof QueryError) || error.code !== "UNAUTHORIZED") {
        throw error;
      }
    }
  })();

  const isOwner = currentArtistId === artist.id;

  if (!artist.is_public && !isOwner) notFound();

  const artworks = await getArtsByArtistId(artist.id);
  const publicArtworks = artworks.filter((art) => art.is_public);
  const privateArtworks = artworks.filter((art) => !art.is_public);
  const visibleArtworks = isOwner ? artworks : publicArtworks;

  return (
    <section className="flex flex-col gap-8">
      <HeroBubble
        badge={<span className="sr-only">Artist profile</span>}
        eyebrow="Artist"
        title={
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {artist.name}
              </h1>
              <Badge variant={artist.is_public ? "default" : "secondary"}>
                {artist.is_public ? "Public profile" : "Private profile"}
              </Badge>
            </div>
            {artist.location ? (
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{artist.location}</span>
              </div>
            ) : null}
          </div>
        }
        description={
          artist.bio?.trim() || "This artist has not added a bio yet."
        }
        titleClassName="max-w-none text-inherit"
        descriptionClassName="max-w-2xl whitespace-pre-wrap"
        actions={
          isOwner ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/artist/edit">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit profile
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/art/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add artwork
                </Link>
              </Button>
            </>
          ) : null
        }
        layoutClassName="gap-8"
        aside={
          <div className="grid gap-3 md:grid-cols-2">
            <StatCard
              label="Profile status"
              value={artist.is_public ? "Public" : "Private"}
              description="Visibility setting for this artist profile."
              icon={<UserRound className="h-4 w-4" />}
            />
            <StatCard
              label="Artwork"
              value={String(visibleArtworks.length)}
              description={
                isOwner
                  ? "Pieces currently attached to this profile."
                  : "Published pieces visible on this profile."
              }
              icon={<Plus className="h-4 w-4" />}
            />
            <StatCard
              label="Links"
              value={String(
                [
                  artist.website,
                  artist.instagram_link,
                  artist.etsy_link,
                  artist.redbubble_link,
                ].filter(Boolean).length,
              )}
              description="External links available from this profile."
              icon={<ExternalLink className="h-4 w-4" />}
              className="md:col-span-2"
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {artist.website ? (
          <ArtistLinkCard
            href={artist.website}
            title="Website"
            description="Visit the artist's main website."
            icon={<ExternalLink className="h-4 w-4" />}
          />
        ) : null}
        {artist.instagram_link ? (
          <ArtistLinkCard
            href={artist.instagram_link}
            title="Instagram"
            description="Open the artist's Instagram profile."
            icon={<Instagram className="h-4 w-4" />}
          />
        ) : null}
        {artist.etsy_link ? (
          <ArtistLinkCard
            href={artist.etsy_link}
            title="Etsy"
            description="Browse the artist's Etsy storefront."
            icon={<Store className="h-4 w-4" />}
          />
        ) : null}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {isOwner
                ? "Your public artwork"
                : `Public artwork by ${artist.name}`}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {isOwner
                ? "Published pieces currently visible on this artist profile."
                : "Browse the published pieces currently visible on this artist profile."}
            </p>
          </div>
          <div className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
            {publicArtworks.length} piece
            {publicArtworks.length === 1 ? "" : "s"}
          </div>
        </div>

        {publicArtworks.length === 0 ? (
          <ArtworkEmptyState
            title="No public artwork yet"
            description={
              isOwner
                ? "Publish a finished piece when you want it to appear on your public artist page."
                : "This artist has not published any artwork yet."
            }
            actionHref={isOwner ? "/art/add" : undefined}
            actionLabel={isOwner ? "Add public artwork" : undefined}
          />
        ) : (
          <div className="grid gap-5 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
            {publicArtworks.map((art) => (
              <ArtworkCard
                key={art.id}
                art={{
                  ...art,
                  artist: {
                    name: artist.name,
                    slug: artist.slug,
                  },
                }}
                isOwner={isOwner}
                hideArtist
                hideOwnerBadge
              />
            ))}
          </div>
        )}
      </div>

      {isOwner ? (
        <div className="rounded-[2rem] border border-border/60 bg-muted/20 p-6 sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Private collection
                </div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Private artwork
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Artwork you have kept private on this artist page. Only you
                  can see these.
                </p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground sm:max-w-sm sm:text-right">
                <div className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
                  {privateArtworks.length} piece
                  {privateArtworks.length === 1 ? "" : "s"}
                </div>
                <p className="leading-6">
                  Use this section as a staging area before publishing pieces to
                  your public artist page.
                </p>
              </div>
            </div>

            {privateArtworks.length === 0 ? (
              <ArtworkEmptyState
                title="No private artwork yet"
                description="Keep draft work private until it is ready to share."
                actionHref="/art/add"
                actionLabel="Add private artwork"
              />
            ) : (
              <div className="grid gap-5 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
                {privateArtworks.map((art) => (
                  <ArtworkCard
                    key={art.id}
                    art={{
                      ...art,
                      artist: {
                        name: artist.name,
                        slug: artist.slug,
                      },
                    }}
                    isOwner
                    hideArtist
                    hideOwnerBadge
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ArtistLinkCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[1.75rem] border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {icon}
          <span>{title}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm leading-6">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full rounded-full">
          <a href={href} target="_blank" rel="noreferrer">
            Open {title}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
