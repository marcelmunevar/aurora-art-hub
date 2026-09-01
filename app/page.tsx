import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { getPublicArtists } from "@/lib/queries/artist";
import Image from "next/image";
import type { FeaturedArtist } from "@/types/artist";
import type { PublicArt } from "@/types/art";
import { getPublicArt, getArtImagePublicUrl } from "@/lib/queries/art";

import { ArtistArtworkPreview } from "@/components/art/ArtistArtworkPreview";
import { HeroBubble } from "@/components/hero-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover public artwork and artist profiles on Aurora Art Hub. Explore new pieces, meet artists, and share your own creative work.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aurora Art Hub",
    description:
      "Discover public artwork and artist profiles on Aurora Art Hub.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Art Hub",
    description:
      "Discover public artwork and artist profiles on Aurora Art Hub.",
  },
};

export default function HomePage() {
  return (
    <section className="flex flex-col gap-14 pb-6">
      <HeroBubble
        badge={
          <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Aurora Art Hub
          </Badge>
        }
        eyebrow="Home"
        title="Discover artists, explore fresh artwork, and share your creative world."
        description="Aurora Art Hub brings artist profiles and public artwork into one discoverable space designed for fast browsing and meaningful connections."
        actions={
          <>
            <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
              <Link href="/art">
                Explore artwork
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:w-auto"
            >
              <Link href="/artist">Meet artists</Link>
            </Button>
          </>
        }
      />

      <section className="space-y-5" aria-labelledby="featured-artist-heading">
        <div className="space-y-2">
          <h2
            id="featured-artist-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Featured artist
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Spotlighting creators whose work shapes the Aurora community.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-72 animate-pulse rounded-[1.75rem] border border-border/60 bg-muted/40" />
            </div>
          }
        >
          <FeaturedArtistSection />
        </Suspense>
      </section>
      <section className="space-y-5" aria-labelledby="featured-artwork-heading">
        <div className="space-y-2">
          <h2
            id="featured-artwork-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Featured artwork
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            A highlighted piece from the Aurora public gallery.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-72 animate-pulse rounded-[1.75rem] border border-border/60 bg-muted/40" />
            </div>
          }
        >
          <FeaturedArtworkSection />
        </Suspense>
      </section>
      <section
        className="space-y-5"
        aria-labelledby="platform-overview-heading"
      >
        <div className="space-y-2">
          <h2
            id="platform-overview-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Platform overview
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Aurora Art Hub is designed to support artists from early drafts to
            public presentation, while helping audiences discover new work.
          </p>
        </div>

        <div className="grid gap-6 min-[900px]:grid-cols-2">
          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Platform
              </Badge>
            }
            eyebrow="Built for artists"
            title="A focused home for art publishing, profile growth, and discovery."
            description="Aurora Art Hub helps artists publish work quickly, keep drafts private while refining, and connect finished pieces directly to a public identity. Viewers can move from gallery browsing to artist profiles in one flow."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />

          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Workflow
              </Badge>
            }
            eyebrow="From draft to public"
            title="Create once, iterate safely, and publish when your work is ready."
            description="Artists can manage public and private visibility, update links to social and storefront channels, and maintain a profile that reflects their current practice. Collectors and fans get a clear, reliable way to discover new work."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />

          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Discovery
              </Badge>
            }
            eyebrow="Connected exploration"
            title="Find new artists and follow the links that matter to your practice."
            description="Each artwork and profile is designed for fast exploration, with direct paths to social channels and storefronts so audiences can go from first impression to deeper engagement in seconds."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />

          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Community
              </Badge>
            }
            eyebrow="People and practice"
            title="Build a profile that evolves with your work and process."
            description="From early experiments to polished collections, Aurora Art Hub supports ongoing updates so your profile, bio, and linked channels reflect where your creative practice is now."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />
        </div>
      </section>
    </section>
  );
}

async function getRandomFeaturedArtist(): Promise<FeaturedArtist | null> {
  try {
    const artists = await getPublicArtists();
    if (!artists || artists.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * artists.length);
    return artists[randomIndex] as FeaturedArtist;
  } catch {
    return null;
  }
}

async function FeaturedArtistSection() {
  const featuredArtist = await getRandomFeaturedArtist();

  return (
    <HeroBubble
      badge={
        <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
          Artist spotlight
        </Badge>
      }
      eyebrow="Featured now"
      title={
        featuredArtist ? (
          <div className="space-y-4">
            <Link
              href={`/artist/${featuredArtist.slug}`}
              className="block text-3xl sm:text-4xl font-semibold tracking-tight hover:underline underline-offset-4"
            >
              {featuredArtist.name}
            </Link>
            {featuredArtist.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{featuredArtist.location}</span>
              </div>
            )}
            {featuredArtist &&
              (featuredArtist.website ||
                featuredArtist.instagram_link ||
                featuredArtist.etsy_link ||
                featuredArtist.redbubble_link) && (
                <SocialLinkButtons
                  profileLinks={[
                    ...(featuredArtist.website
                      ? [{ label: "Website", href: featuredArtist.website }]
                      : []),
                    ...(featuredArtist.instagram_link
                      ? [
                          {
                            label: "Instagram",
                            href: featuredArtist.instagram_link,
                          },
                        ]
                      : []),
                    ...(featuredArtist.etsy_link
                      ? [{ label: "Etsy", href: featuredArtist.etsy_link }]
                      : []),
                    ...(featuredArtist.redbubble_link
                      ? [
                          {
                            label: "Redbubble",
                            href: featuredArtist.redbubble_link,
                          },
                        ]
                      : []),
                  ]}
                  actionLinks={[
                    {
                      label: "View profile",
                      href: `/artist/${featuredArtist.slug}`,
                      kind: "view-profile",
                    },
                  ]}
                />
              )}
          </div>
        ) : (
          "A featured artist will appear here once public profiles are available."
        )
      }
      description={
        featuredArtist
          ? featuredArtist.bio?.trim() ||
            `${featuredArtist.name} is currently featured in the Aurora spotlight.${featuredArtist.location ? ` Based in ${featuredArtist.location}.` : ""}`
          : "Publish artist profiles to power this spotlight with live community data."
      }
      className="rounded-[2rem]"
      descriptionClassName="text-base leading-8"
      aside={
        featuredArtist ? (
          <ArtistArtworkPreview
            artistId={featuredArtist.id}
            className="w-full min-w-0 lg:w-[22rem]"
            frameClassName="h-72 rounded-[1.75rem] bg-background/90"
            sizes="(min-width: 1024px) 22rem, 100vw"
          />
        ) : null
      }
    />
  );
}

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

async function FeaturedArtworkSection() {
  const featuredArt = await getRandomFeaturedArt();

  let imageSrc: string | null = null;

  if (featuredArt?.image_path) {
    try {
      imageSrc = getArtImagePublicUrl(featuredArt.image_path);
    } catch {
      imageSrc = null;
    }
  }

  return (
    <HeroBubble
      badge={
        <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
          Artwork spotlight
        </Badge>
      }
      eyebrow="Featured now"
      title={
        featuredArt ? (
          <div className="space-y-4">
            <Link
              href={`/art/${featuredArt.slug}`}
              className="block text-3xl sm:text-4xl font-semibold tracking-tight hover:underline underline-offset-4"
            >
              {featuredArt.title}
            </Link>
            {featuredArt.artist && (
              <Link
                href={`/artist/${featuredArt.artist.slug}`}
                className="text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                {featuredArt.artist.name}
              </Link>
            )}
            {(featuredArt.instagram_url || featuredArt.etsy_url) && (
              <SocialLinkButtons
                profileLinks={[
                  ...(featuredArt.instagram_url
                    ? [{ label: "Instagram", href: featuredArt.instagram_url }]
                    : []),
                  ...(featuredArt.etsy_url
                    ? [{ label: "Etsy", href: featuredArt.etsy_url }]
                    : []),
                ]}
                actionLinks={
                  featuredArt.artist
                    ? [
                        {
                          label: "View artwork",
                          href: `/art/${featuredArt.slug}`,
                          kind: "view-artwork",
                        },
                        {
                          label: "View artist",
                          href: `/artist/${featuredArt.artist.slug}`,
                          kind: "view-profile",
                        },
                      ]
                    : [
                        {
                          label: "View artwork",
                          href: `/art/${featuredArt.slug}`,
                          kind: "view-artwork",
                        },
                      ]
                }
                className="pt-1"
              />
            )}
          </div>
        ) : (
          "A featured artwork will appear here once public pieces are available."
        )
      }
      description={
        featuredArt
          ? featuredArt.description ||
            "A highlighted piece from the Aurora gallery."
          : "Publish artwork to populate this spotlight with live community work."
      }
      className="rounded-[2rem]"
      descriptionClassName="text-base leading-8"
      aside={
        featuredArt ? (
          <ArtistArtworkPreview
            artistId={featuredArt.artist_id}
            artworks={
              featuredArt
                ? [
                    {
                      artist_id: featuredArt.artist_id,
                      slug: featuredArt.slug,
                      title: featuredArt.title,
                      image_path: featuredArt.image_path,
                      instagram_url: featuredArt.instagram_url,
                    },
                  ]
                : undefined
            }
            className="w-full min-w-0 lg:w-[22rem]"
            frameClassName="h-72 rounded-[1.75rem] bg-background/90"
            sizes="(min-width: 1024px) 22rem, 100vw"
          />
        ) : null
      }
    />
  );
}
