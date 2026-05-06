import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  LayoutDashboard,
  Palette,
  Plus,
  Shield,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArtworkCard, ArtworkEmptyState } from "@/app/art/_components/ArtList";
import { getCurrentUserArt } from "@/lib/queries/art";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import { createClient } from "@/lib/supabase/server";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const artist = await getCurrentUserArtist();
  const artworks = artist ? await getCurrentUserArt() : [];
  const publicArtworks = artworks.filter((art) => art.is_public);
  const privateArtworks = artworks.filter((art) => !art.is_public);
  const publicCount = artworks.filter((art) => art.is_public).length;
  const privateCount = artworks.length - publicCount;
  const userEmail =
    typeof data.claims.email === "string" ? data.claims.email : null;

  return (
    <section className="flex flex-col gap-10 pb-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_hsl(var(--chart-2)/0.16),_transparent_30%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.6))] p-8 shadow-sm sm:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_hsl(var(--foreground)/0.08),_transparent_58%)] lg:block" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
              <LayoutDashboard className="mr-1 h-3.5 w-3.5" />
              Dashboard
            </Badge>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                Studio overview
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Keep your profile, artwork, and visibility controls in one
                place.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {userEmail
                  ? `Signed in as ${userEmail}. Review your artist profile, track public versus private pieces, and jump back into editing.`
                  : "Review your artist profile, track public versus private pieces, and jump back into editing."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
                <Link href="/profile">
                  {artist ? "Manage profile" : "Create profile"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 sm:w-auto"
              >
                <Link href={artist ? "/art/add" : "/art"}>
                  {artist ? "Add artwork" : "Browse gallery"}
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:w-[30rem] xl:grid-cols-3">
            <DashboardStatCard
              label="Artist profile"
              value={artist ? artist.name : "Missing"}
              description={
                artist
                  ? artist.is_public
                    ? "Public and discoverable"
                    : "Saved privately"
                  : "Set up your studio identity"
              }
              icon={<UserRound className="h-4 w-4" />}
            />
            <DashboardStatCard
              label="Total pieces"
              value={String(artworks.length)}
              description="Artwork attached to your account"
              icon={<Palette className="h-4 w-4" />}
            />
            <DashboardStatCard
              label="Visibility split"
              value={`${publicCount}/${privateCount}`}
              description="Public / private pieces"
              icon={<Shield className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="rounded-[1.75rem] border-border/60">
          <CardHeader>
            <CardTitle>Studio snapshot</CardTitle>
            <CardDescription>
              The essentials for keeping your artist presence current.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SnapshotTile
              label="Profile status"
              value={artist ? "Ready" : "Needs setup"}
              helper={
                artist
                  ? "Your artist profile is attached."
                  : "Create a profile to publish under your name."
              }
            />
            <SnapshotTile
              label="Public artwork"
              value={String(publicCount)}
              helper="Pieces visible in the main gallery."
            />
            <SnapshotTile
              label="Private artwork"
              value={String(privateCount)}
              helper="Pieces hidden until you are ready to share."
            />
            <SnapshotTile
              label="Latest focus"
              value={artworks[0]?.title ?? "No artwork yet"}
              helper={
                artworks[0]
                  ? "Most recently updated piece in your studio."
                  : "Your first piece will appear here."
              }
            />
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/60">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump directly into the next task that keeps your studio moving.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <QuickActionLink
              href="/profile"
              title={
                artist
                  ? "Update your artist profile"
                  : "Create your artist profile"
              }
              description={
                artist
                  ? "Refresh bio, links, location, and visibility."
                  : "Set the name, slug, and links used across the hub."
              }
            />
            <QuickActionLink
              href={artist ? "/art/add" : "/art"}
              title={
                artist ? "Add a new artwork" : "Explore the public gallery"
              }
              description={
                artist
                  ? "Create a draft or publish a finished piece."
                  : "Browse existing work while you finish your profile."
              }
            />
            {artist?.slug ? (
              <QuickActionLink
                href={`/artist/${artist.slug}`}
                title="View your public artist page"
                description="Check how your profile appears to other visitors."
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <OwnedArtworkSection
        title="Your public artwork"
        description="Published pieces currently visible in the gallery."
        artworks={publicArtworks}
        emptyTitle="No public artwork yet"
        emptyDescription={
          artist
            ? "Publish a finished piece when you want it to appear in the public gallery."
            : "Create your artist profile first, then publish artwork under your name."
        }
        emptyHref={artist ? "/art/add" : "/profile"}
        emptyCta={artist ? "Add public artwork" : "Create profile"}
      />

      <OwnedArtworkSection
        title="Private artwork"
        description="Work in progress, drafts, and pieces you are keeping off the public gallery."
        artworks={privateArtworks}
        emptyTitle="No private artwork yet"
        emptyDescription={
          artist
            ? "Keep draft work private until it is ready to share."
            : "Create your artist profile first, then private pieces can live here."
        }
        emptyHref={artist ? "/art/add" : "/profile"}
        emptyCta={artist ? "Add private artwork" : "Create profile"}
      />
    </section>
  );
}

function DashboardFallback() {
  return (
    <section className="flex flex-col gap-10 pb-6">
      <div className="rounded-[2rem] border border-border/60 bg-muted/20 p-8 shadow-sm sm:p-10">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-28 rounded-full bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-12 max-w-2xl rounded bg-muted" />
          <div className="h-6 max-w-3xl rounded bg-muted" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-full rounded-full bg-muted sm:w-40" />
            <div className="h-11 w-full rounded-full bg-muted sm:w-40" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="rounded-[1.75rem] border-border/60">
          <CardHeader>
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"
              >
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-8 w-28 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/60">
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"
              >
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function DashboardStatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-h-40 rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur">
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

function SnapshotTile({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-xl font-semibold leading-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

function QuickActionLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}

function OwnedArtworkSection({
  title,
  description,
  artworks,
  emptyTitle,
  emptyDescription,
  emptyHref,
  emptyCta,
}: {
  title: string;
  description: string;
  artworks: Array<{
    id: number;
    slug: string;
    title: string;
    description: string | null;
    is_public: boolean;
  }>;
  emptyTitle: string;
  emptyDescription: string;
  emptyHref: string;
  emptyCta: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <div className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          {artworks.length} piece{artworks.length === 1 ? "" : "s"}
        </div>
      </div>

      {artworks.length === 0 ? (
        <ArtworkEmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionHref={emptyHref}
          actionLabel={emptyCta}
        />
      ) : (
        <div className="grid gap-5 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
          {artworks.map((art) => (
            <ArtworkCard
              key={art.id}
              art={{
                ...art,
                artist: null,
              }}
              isOwner
              hideArtist
              hideOwnerBadge
            />
          ))}
        </div>
      )}
    </div>
  );
}
