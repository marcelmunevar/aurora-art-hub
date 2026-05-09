import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getArtBySlug, getArtImagePublicUrl } from "@/lib/queries/art";
import { getArtistById, getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";
import { Badge } from "@/components/ui/badge";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";
import { LinkPreview } from "@/components/link-previews/link-preview";

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

  let imageUrl: string | null = null;

  if (art.image_path) {
    try {
      imageUrl = getArtImagePublicUrl(art.image_path);
    } catch {
      imageUrl = null;
    }
  }

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
  ].filter(Boolean) as Array<{ label: string; href: string }>;

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

      {profileLinks.length > 0 || isOwner ? (
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
      ) : null}

      {art.description && (
        <p className="max-w-4xl whitespace-pre-wrap text-base leading-7 text-muted-foreground">
          {art.description}
        </p>
      )}

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={art.title}
          width={art.image_width ?? 1200}
          height={art.image_height ?? 900}
          className="self-start rounded-2xl object-contain"
          style={{ width: "auto", height: "auto", maxHeight: "520px" }}
        />
      ) : null}

      {art.instagram_url ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Instagram
          </p>
          <LinkPreview url={art.instagram_url} />
        </div>
      ) : null}
    </section>
  );
}
