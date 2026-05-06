import { Suspense } from "react";

import Link from "next/link";
import { ArrowRight, Globe, MapPin, Sparkles, UserRound } from "lucide-react";

import { HeroBubble } from "@/components/hero-bubble";
import { StatCardFallbackGrid } from "@/components/stat-card-fallback-grid";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCurrentUserArtist, getPublicArtists } from "@/lib/queries/artist";
import { createClient } from "@/lib/supabase/server";
import { ArtistList } from "./_components/ArtistList";

function ArtistListFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col">
          <CardHeader className="gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 animate-pulse rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-6 w-3/5 animate-pulse rounded bg-muted" />
                <div className="h-5 w-2/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
            <div className="h-9 w-full animate-pulse rounded bg-muted sm:w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <section className="flex flex-col gap-14 pb-6">
      <HeroBubble
        badge={
          <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Aurora artists
          </Badge>
        }
        eyebrow="Artists"
        title="Explore the people behind the work."
        description="Browse public profiles from Aurora artists, follow their links, and jump directly into the work attached to each practice."
        actions={
          <>
            <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
              <Link href="#public-artists">
                Browse artists
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Suspense fallback={null}>
              <AuthenticatedHeroAction />
            </Suspense>
          </>
        }
        aside={
          <Suspense fallback={<HeroStatsFallback />}>
            <HeroStats />
          </Suspense>
        }
      />

      <div id="public-artists" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Public artists
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Discover public artist profiles, then open each profile for bios,
              links, and published work.
            </p>
          </div>
          <div className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
            Profiles ready for discovery and quick comparison
          </div>
        </div>
        <Suspense fallback={<ArtistListFallback />}>
          <ArtistList />
        </Suspense>
      </div>
    </section>
  );
}

async function HeroStats() {
  const supabase = await createClient();
  const [{ data }, publicArtists] = await Promise.all([
    supabase.auth.getClaims(),
    getPublicArtists(),
  ]);

  const isAuthenticated = !!data?.claims;
  const currentArtist = isAuthenticated ? await getCurrentUserArtist() : null;
  const withLocationCount = publicArtists.filter(
    (artist) => artist.location,
  ).length;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <StatCard
        label="Public artists"
        value={String(publicArtists.length)}
        description="Profiles visible across the Aurora directory."
        icon={<Globe className="h-4 w-4" />}
      />
      <StatCard
        label="Your profile"
        value={currentArtist ? currentArtist.name : "Guest view"}
        description={
          currentArtist
            ? currentArtist.is_public
              ? "Your profile is public and discoverable."
              : "Your profile is currently private."
            : "Sign in to manage your artist profile."
        }
        icon={<UserRound className="h-4 w-4" />}
      />
      <StatCard
        label="Mapped profiles"
        value={String(withLocationCount)}
        description="Public artists currently sharing a visible location."
        icon={<MapPin className="h-4 w-4" />}
        className="md:col-span-2"
      />
    </div>
  );
}

function HeroStatsFallback() {
  return <StatCardFallbackGrid />;
}

async function AuthenticatedHeroAction() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) return null;

  const currentArtist = await getCurrentUserArtist();

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="rounded-full px-6 sm:w-auto"
    >
      <Link
        href={currentArtist ? `/artist/${currentArtist.slug}` : "/artist/edit"}
      >
        {currentArtist ? "View your profile" : "Create your profile"}
      </Link>
    </Button>
  );
}
