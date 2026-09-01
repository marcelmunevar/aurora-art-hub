import Link from "next/link";
import { getPublicArt } from "@/lib/queries/art";
import type { PublicArt } from "@/types/art";
import { HeroBubble } from "@/components/hero-bubble";
import { Badge } from "@/components/ui/badge";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";
import { ArtistArtworkPreview } from "@/components/art/ArtistArtworkPreview";

async function getRandomFeaturedArt(): Promise<PublicArt | null> {
  try {
    const arts = await getPublicArt();
    if (!arts || arts.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * arts.length);
    return arts[randomIndex] as PublicArt;
  } catch {
    return null;
  }
}

export async function FeaturedArt() {
  const art = await getRandomFeaturedArt();

  const profileLinks = art
    ? ([
        art.instagram_url
          ? { label: "Instagram", href: art.instagram_url }
          : null,
        art.etsy_url ? { label: "Etsy", href: art.etsy_url } : null,
      ].filter(Boolean) as Array<{ label: string; href: string }>)
    : [];

  return (
    <HeroBubble
      badge={
        <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
          Artwork spotlight
        </Badge>
      }
      eyebrow="Featured now"
      title={
        art ? (
          <div className="space-y-2">
            <Link
              href={`/art/${art.slug}`}
              className="block hover:underline underline-offset-4"
            >
              {art.title}
            </Link>
            {art.artist ? (
              <Link
                href={`/artist/${art.artist.slug}`}
                className="block text-sm font-normal text-muted-foreground hover:underline underline-offset-4"
              >
                {art.artist.name}
              </Link>
            ) : null}
          </div>
        ) : (
          "A featured artwork will appear here once public pieces are available."
        )
      }
      description={
        art
          ? art.description || "A highlighted piece from the Aurora gallery."
          : "Publish artwork to populate this spotlight with live community work."
      }
      actions={
        art ? (
          <SocialLinkButtons
            profileLinks={profileLinks}
            actionLinks={
              art.artist
                ? [
                    {
                      label: "View artwork",
                      href: `/art/${art.slug}`,
                      kind: "view-artwork",
                    },
                    {
                      label: "View artist",
                      href: `/artist/${art.artist.slug}`,
                      kind: "view-profile",
                    },
                  ]
                : [
                    {
                      label: "View artwork",
                      href: `/art/${art.slug}`,
                      kind: "view-artwork",
                    },
                  ]
            }
            className="w-full sm:max-w-xs"
          />
        ) : null
      }
      className="rounded-[2rem]"
      descriptionClassName="text-base leading-8"
      aside={
        art ? (
          <ArtistArtworkPreview
            artistId={art.artist_id}
            artworks={[
              {
                artist_id: art.artist_id,
                slug: art.slug,
                title: art.title,
                image_path: art.image_path,
                instagram_url: art.instagram_url,
              },
            ]}
            className="w-64 sm:w-72 lg:w-[22rem] lg:min-w-0 lg:self-center"
            frameClassName="bg-background/90"
            sizes="(min-width: 1024px) 22rem, 18rem"
          />
        ) : null
      }
    />
  );
}
