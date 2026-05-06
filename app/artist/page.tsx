import { Suspense } from "react";

import Link from "next/link";
import { ArrowRight, Globe, MapPin, Sparkles, UserRound } from "lucide-react";

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
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_hsl(var(--chart-2)/0.16),_transparent_30%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.6))] p-8 shadow-sm sm:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_hsl(var(--foreground)/0.08),_transparent_58%)] lg:block" />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Aurora artists
            </Badge>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                Artists
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Explore the people behind the work.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Browse public profiles from Aurora artists, follow their links,
                and jump directly into the work attached to each practice.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
                <Link href="#public-artists">
                  Browse artists
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Suspense fallback={null}>
                <AuthenticatedHeroAction />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<HeroStatsFallback />}>
            <HeroStats />
          </Suspense>
        </div>
      </div>

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
    <div className="grid gap-3 md:grid-cols-2 xl:w-[30rem] xl:grid-cols-3">
      <HeroStatCard
        label="Public artists"
        value={String(publicArtists.length)}
        description="Profiles visible across the Aurora directory."
        icon={<Globe className="h-4 w-4" />}
      />
      <HeroStatCard
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
      <HeroStatCard
        label="Mapped profiles"
        value={String(withLocationCount)}
        description="Public artists currently sharing a visible location."
        icon={<MapPin className="h-4 w-4" />}
        className="md:col-span-2 xl:col-span-1"
      />
    </div>
  );
}

function HeroStatsFallback() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:w-[30rem] xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur"
        >
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-28 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroStatCard({
  label,
  value,
  description,
  icon,
  className,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold leading-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

async function AuthenticatedHeroAction() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) return null;

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="rounded-full px-6 sm:w-auto"
    >
      <Link href="/profile/edit">Manage your profile</Link>
    </Button>
  );
}
