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
import { StatCardFallbackGrid } from "@/components/stat-card-fallback-grid";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUserArt } from "@/lib/queries/art";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import { createClient } from "@/lib/supabase/server";

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-10 pb-6">
      <Suspense fallback={null}>
        <RequireAuthenticatedUser />
      </Suspense>
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
          <>
            <Suspense fallback={null}>
              <AuthenticatedUserEmailPrefix />
            </Suspense>
            Review your artist profile, track public versus private pieces, and
            jump back into editing.
          </>
        }
        contentClassName="space-y-5"
        textClassName="space-y-3"
        layoutClassName="gap-8"
        actions={
          <>
            <Suspense fallback={null}>
              <AuthenticatedHeroAction />
            </Suspense>
            <Suspense fallback={null}>
              <GalleryHeroAction />
            </Suspense>
          </>
        }
        aside={
          <Suspense fallback={<StatCardFallbackGrid />}>
            <DashboardStats />
          </Suspense>
        }
      />
    </section>
  );
}

async function DashboardStats() {
  const artist = await getCurrentUserArtist();
  const artworks = artist ? await getCurrentUserArt() : [];
  const publicCount = artworks.filter((art) => art.is_public).length;
  const privateCount = artworks.length - publicCount;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <StatCard
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
      <StatCard
        label="Total pieces"
        value={String(artworks.length)}
        description="Artwork attached to your account"
        icon={<Palette className="h-4 w-4" />}
      />
      <StatCard
        label="Visibility split"
        value={`${publicCount}/${privateCount}`}
        description="Public / private pieces"
        icon={<Shield className="h-4 w-4" />}
        className="md:col-span-2"
      />
    </div>
  );
}

async function RequireAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return null;
}

async function AuthenticatedUserEmailPrefix() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userEmail =
    typeof data.claims.email === "string" ? data.claims.email : null;

  if (!userEmail) return null;

  return <>Signed in as {userEmail}. </>;
}

async function GalleryHeroAction() {
  const artist = await getCurrentUserArtist();

  return (
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
  );
}

async function AuthenticatedHeroAction() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) return null;

  const artist = await getCurrentUserArtist();

  return (
    <Button asChild size="lg" className="rounded-full px-6 sm:w-auto">
      <Link href={artist ? `/artist/${artist.slug}` : "/artist/edit"}>
        {artist ? "View profile" : "Create profile"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
