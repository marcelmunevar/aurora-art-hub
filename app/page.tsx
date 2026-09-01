import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { FeaturedArt } from "@/components/art/FeaturedArt";
import { FeaturedArtist } from "@/components/art/FeaturedArtist";
import { HeroBubble } from "@/components/hero-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
          <FeaturedArtist />
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
          <FeaturedArt />
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
