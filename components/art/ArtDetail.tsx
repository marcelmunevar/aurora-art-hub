import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getArtBySlug, getArtImagePublicUrl } from "@/lib/queries/art";
import { getArtistById, getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";
import { Badge } from "@/components/ui/badge";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";

export async function ArtDetail({ artSlug }: { artSlug: string }) {
  const art = await getArtBySlug(artSlug);

  if (!art) notFound();

  let currentArtistId: number | null = null;

  const [artist] = await Promise.all([
    getArtistById(art.artist_id),
    (async () => {
      try {
        const currentArtist = await getCurrentUserArtist();
        currentArtistId = currentArtist?.id ?? null;
      } catch (error) {
        if (!(error instanceof QueryError) || error.code !== "UNAUTHORIZED") {
          throw error;
        }
      }
    })(),
  ]);

  const isOwner = currentArtistId === art.artist_id;

  if (!art.is_public && !isOwner) notFound();

  // image_path is always set: validation requires an image on create and edit.
  const imageUrl = getArtImagePublicUrl(art.image_path!);

  const profileLinks = [
    art.instagram_url
      ? {
          label: "Instagram",
          href: art.instagram_url,
        }
      : null,
    art.etsy_url
      ? {
          label: "Etsy",
          href: art.etsy_url,
        }
      : null,
    art.redbubble_url
      ? {
          label: "Redbubble",
          href: art.redbubble_url,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const actionButtons =
    profileLinks.length > 0 || isOwner ? (
      <div className="space-y-2 sm:max-w-xs">
        <SocialLinkButtons
          profileLinks={profileLinks}
          actionLinks={
            isOwner
              ? [
                  {
                    label: "Edit artwork",
                    href: `/art/${art.slug}/edit`,
                    kind: "edit-artwork",
                  },
                ]
              : undefined
          }
        />
      </div>
    ) : null;

  const descriptionText = art.description && (
    <p className="whitespace-pre-wrap text-base leading-7 text-muted-foreground">
      {art.description}
    </p>
  );

  return (
    <section className="w-full flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Artwork
        </p>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {art.title}
            </h1>
            <Badge variant={art.is_public ? "default" : "secondary"}>
              {art.is_public ? "Public" : "Private"}
            </Badge>
          </div>
          {artist && (
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href={`/artist/${artist.slug}`}
                className="text-foreground hover:underline"
              >
                {artist.name}
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <Image
            src={imageUrl}
            alt={art.title}
            width={art.image_width ?? 1200}
            height={art.image_height ?? 900}
            className="rounded-2xl object-contain"
            style={{ width: "auto", height: "auto", maxHeight: "520px" }}
          />
        </div>

        <div className="space-y-6">
          {actionButtons}
          {descriptionText}
        </div>
      </div>
    </section>
  );
}
