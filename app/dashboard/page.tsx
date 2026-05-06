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

import { HeroBubble } from "@/components/hero-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const publicCount = artworks.filter((art) => art.is_public).length;
  const privateCount = artworks.length - publicCount;
  const userEmail =
    typeof data.claims.email === "string" ? data.claims.email : null;

  return (
    <section className="flex flex-col gap-10 pb-6">
      <HeroBubble
        badge={
          <Badge className="w-fit rounded-full border-transparent bg-foreground text-background">
            <LayoutDashboard className="mr-1 h-3.5 w-3.5" />
            Dashboard
          </Badge>
        }
        eyebrow="Studio overview"
        title="Keep your profile, artwork, and visibility controls in one place."
        description={
          userEmail
            ? `Signed in as ${userEmail}. Review your artist profile, track public versus private pieces, and jump back into editing.`
            : "Review your artist profile, track public versus private pieces, and jump back into editing."
        }
        contentClassName="space-y-5"
        textClassName="space-y-3"
        layoutClassName="gap-8"
        actions={
          <>
            <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
              <Link href={artist ? `/artist/${artist.slug}` : "/artist/edit"}>
                {artist ? "View profile" : "Create profile"}
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
          </>
        }
        aside={
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
        }
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
