import Link from "next/link";
import { MapPin } from "lucide-react";
import { getPublicArtists } from "@/lib/queries/artist";
import type { PublicArtist } from "@/types/artist";
import { HeroBubble } from "@/components/hero-bubble";
import { Badge } from "@/components/ui/badge";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";
import { ArtistArtworkPreview } from "@/components/art/ArtistArtworkPreview";

async function getRandomFeaturedArtist(): Promise<PublicArtist | null> {
  try {
    const artists = await getPublicArtists();
    if (!artists || artists.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * artists.length);
    return artists[randomIndex];
  } catch {
    return null;
  }
}

export async function FeaturedArtist() {
  const artist = await getRandomFeaturedArtist();

  const profileLinks = artist
    ? ([
        artist.website ? { label: "Website", href: artist.website } : null,
        artist.instagram_link
          ? { label: "Instagram", href: artist.instagram_link }
          : null,
        artist.etsy_link ? { label: "Etsy", href: artist.etsy_link } : null,
        artist.redbubble_link
          ? { label: "Redbubble", href: artist.redbubble_link }
          : null,
      ].filter(Boolean) as Array<{ label: string; href: string }>)
    : [];

  return (
    <HeroBubble
      badge={
        <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
          Artist spotlight
        </Badge>
      }
      eyebrow="Featured now"
      title={
        artist ? (
          <div className="space-y-2">
            <Link
              href={`/artist/${artist.slug}`}
              className="block hover:underline underline-offset-4"
            >
              {artist.name}
            </Link>
            {artist.location ? (
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{artist.location}</span>
              </div>
            ) : null}
          </div>
        ) : (
          "A featured artist will appear here once public profiles are available."
        )
      }
      description={
        artist
          ? artist.bio?.trim() ||
            `${artist.name} is currently featured in the Aurora spotlight.${artist.location ? ` Based in ${artist.location}.` : ""}`
          : "Publish artist profiles to power this spotlight with live community data."
      }
      actions={
        artist ? (
          <SocialLinkButtons
            profileLinks={profileLinks}
            actionLinks={[
              {
                label: "View profile",
                href: `/artist/${artist.slug}`,
                kind: "view-profile",
              },
            ]}
            className="w-full sm:max-w-xs"
          />
        ) : null
      }
      className="rounded-[2rem]"
      descriptionClassName="text-base leading-8"
      aside={
        artist ? (
          <ArtistArtworkPreview
            artistId={artist.id}
            className="w-64 sm:w-72 lg:w-[22rem] lg:min-w-0 lg:self-center"
            frameClassName="bg-background/90"
            sizes="(min-width: 1024px) 22rem, 18rem"
          />
        ) : null
      }
    />
  );
}
