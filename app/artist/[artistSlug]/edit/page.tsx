import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueryError } from "@/lib/queries/errors";
import { getCurrentUserArtist } from "@/lib/queries/artist";

import { ProfileForm } from "./_components/ProfileForm";

type ArtistEditPageProps = {
  params: Promise<{
    artistSlug: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function ProfileFormFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading profile</CardTitle>
        <CardDescription>Fetching your artist profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 animate-pulse">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-muted" />
            <div className="h-32 rounded-md bg-muted" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-md bg-muted" />
          </div>

          <div className="h-10 w-full rounded-md bg-muted md:w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

function ArtistEditPageFallback() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-sm text-muted-foreground">
          Create or update the artist profile attached to your account.
        </p>
      </div>
      <ProfileFormFallback />
    </div>
  );
}

async function ArtistEditPageContent({
  params,
  searchParams,
}: ArtistEditPageProps) {
  const { artistSlug } = await params;

  let artist;

  try {
    artist = await getCurrentUserArtist();
  } catch (error) {
    if (error instanceof QueryError && error.code === "UNAUTHORIZED") {
      redirect("/auth/login");
    }

    throw error;
  }

  if (!artist) {
    redirect("/artist/edit");
  }

  if (artist.slug !== artistSlug) {
    if (artist.slug) {
      redirect(`/artist/${artist.slug}/edit`);
    }

    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-sm text-muted-foreground">
          Create or update the artist profile attached to your account.
        </p>
      </div>
      <ProfileForm searchParams={searchParams} />
    </div>
  );
}

export default function Page({ params, searchParams }: ArtistEditPageProps) {
  return (
    <Suspense fallback={<ArtistEditPageFallback />}>
      <ArtistEditPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
