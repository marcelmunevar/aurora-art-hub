import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArtList } from "./_components/ArtList";

function ArtListFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

export default async function Page() {
  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Art
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore public artwork
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Browse public artwork shared by Aurora Art Hub artists and jump
              into each piece for more details.
            </p>
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

async function PrivateArtSection() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your private artwork
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Artwork you have kept private. Only you can see these.
        </p>
      </div>
      <Suspense fallback={<ArtListFallback />}>
        <ArtList type="private" />
      </Suspense>
    </div>
  );
}
