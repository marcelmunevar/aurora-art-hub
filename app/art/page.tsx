import { Suspense } from "react";

import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArtList } from "./_components/ArtList";

function ArtListFallback() {
  return (
    <div className="grid gap-4 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col">
          <CardHeader className="gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-6 w-3/5 animate-pulse rounded bg-muted" />
                <div className="h-5 w-2/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
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
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.14),_transparent_32%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.55))] p-8 shadow-sm sm:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_hsl(var(--foreground)/0.08),_transparent_58%)] lg:block" />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Aurora gallery
            </Badge>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                Art
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Explore a living wall of work from Aurora artists.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Browse public pieces, open detail pages instantly, and manage
                your own private collection from the same gallery surface.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
                <Link href="#public-gallery">
                  Browse public art
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Suspense fallback={null}>
                <AuthenticatedHeroAction />
              </Suspense>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:w-[30rem] xl:grid-cols-3">
            <div className="min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Public gallery
              </p>
              <p className="mt-3 text-2xl font-semibold">Open discovery</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Published work from across the hub, arranged for quick scanning.
              </p>
            </div>
            <div className="min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Detail first
              </p>
              <p className="mt-3 text-2xl font-semibold">Fast context</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Each card surfaces artist, privacy state, and preview links.
              </p>
            </div>
            <div className="min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur md:col-span-2 xl:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Private studio
              </p>
              <p className="mt-3 text-2xl font-semibold">Owner-only</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Signed-in artists can keep works hidden until they are ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="public-gallery" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Public artwork
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Browse public artwork shared by Aurora Art Hub artists and jump
              into each piece for more details.
            </p>
          </div>
          <div className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
            Curated for discovery and quick comparison
          </div>
        </div>
        <Suspense fallback={<ArtListFallback />}>
          <ArtList type="public" />
        </Suspense>
      </div>

      <Suspense>
        <PrivateArtSection />
      </Suspense>
    </section>
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
      <Link href="/art/add">Share new artwork</Link>
    </Button>
  );
}

async function PrivateArtSection() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;

  if (!isAuthenticated) return null;

  return (
    <div className="rounded-[2rem] border border-border/60 bg-muted/20 p-6 sm:p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Private collection
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your private artwork
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Artwork you have kept private. Only you can see these.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Use this section as a staging area before publishing pieces to the
            public gallery.
          </p>
        </div>
        <Suspense fallback={<ArtListFallback />}>
          <ArtList type="private" />
        </Suspense>
      </div>
    </div>
  );
}
