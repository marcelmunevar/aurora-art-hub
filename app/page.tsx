import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

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

function HomePageFallback() {
  return (
    <section className="space-y-10">
      <div className="h-72 animate-pulse rounded-[2rem] border border-border/60 bg-muted/40" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.5rem] border border-border/60 bg-muted/40"
          />
        ))}
      </div>
      <div className="grid gap-4 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.5rem] border border-border/60 bg-muted/40"
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

type FeaturedArtist = {
  slug: string;
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  instagram_link: string | null;
  etsy_link: string | null;
  redbubble_link: string | null;
};

async function getRandomFeaturedArtist(): Promise<FeaturedArtist | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await supabase
    .from("artist")
    .select(
      "slug, name, bio, location, website, instagram_link, etsy_link, redbubble_link",
    )
    .eq("is_public", true)
    .limit(100);

  if (error || !data || data.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as FeaturedArtist;
}

async function HomePageContent() {
  const featuredArtist = await getRandomFeaturedArtist();
  const featuredArtistInfo = featuredArtist
    ? [
        {
          label: "Location",
          value: featuredArtist.location,
          href: null,
          actionLabel: null,
        },
        {
          label: "Website",
          value: featuredArtist.website,
          href: featuredArtist.website,
          actionLabel: "Visit",
        },
        {
          label: "Instagram",
          value: featuredArtist.instagram_link,
          href: featuredArtist.instagram_link,
          actionLabel: "Open",
        },
        {
          label: "Etsy",
          value: featuredArtist.etsy_link,
          href: featuredArtist.etsy_link,
          actionLabel: "Open",
        },
        {
          label: "Redbubble",
          value: featuredArtist.redbubble_link,
          href: featuredArtist.redbubble_link,
          actionLabel: "Open",
        },
      ].filter((item) => !!item.value)
    : [];
  const profileLinks = featuredArtistInfo
    .filter((item) => item.label !== "Location" && item.href)
    .map((item) => ({
      label: item.label,
      href: item.href as string,
    }));

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
                {(profileLinks.length > 0 || featuredArtist) && (
                  <SocialLinkButtons
                    profileLinks={profileLinks}
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
        />
      </section>

      <section className="space-y-5" aria-labelledby="platform-values-heading">
        <div className="space-y-2">
          <h2
            id="platform-values-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Why artists choose Aurora
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Two core principles guide the product experience: creator control
            and audience clarity.
          </p>
        </div>

        <div className="grid gap-6 min-[900px]:grid-cols-2">
          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Control
              </Badge>
            }
            eyebrow="Publish on your terms"
            title="Keep private work private until it is ready to be seen."
            description="Visibility settings and profile updates are designed to let artists test ideas, refine presentation, and decide exactly when each piece enters the public gallery."
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
                Clarity
              </Badge>
            }
            eyebrow="Simple discovery"
            title="Help audiences move from browsing to meaningful engagement."
            description="Clean profile and artwork pages reduce friction, making it easy for viewers to understand an artist's voice, follow their channels, and stay connected as new work appears."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="seo-benefits-heading">
        <div className="space-y-2">
          <h2
            id="seo-benefits-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Improve your online presence
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Aurora Art Hub helps your work and profile get discovered through
            search engines.
          </p>
        </div>

        <div className="grid gap-6 min-[900px]:grid-cols-2">
          <HeroBubble
            badge={
              <Badge
                variant="secondary"
                className="w-fit rounded-full border-transparent"
              >
                Visibility
              </Badge>
            }
            eyebrow="Searchable profiles"
            title="Your work appears in search results alongside your artist profile."
            description="Each piece and profile is indexed by search engines, making your portfolio discoverable when people search for your name, style, or subject matter. Build discoverability without managing your own website."
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
                Authority
              </Badge>
            }
            eyebrow="Link back to your channels"
            title="Direct connections to your website and storefronts boost your online presence."
            description="Your Aurora profile links to your personal site, shop, and social channels. This helps search engines understand your online presence and sends interested viewers directly to where they can engage with your work."
            className="h-full rounded-[1.75rem]"
            titleClassName="text-2xl sm:text-3xl"
            descriptionClassName="text-sm leading-7"
          />
        </div>
      </section>
    </section>
  );
}
