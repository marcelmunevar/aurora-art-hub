import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArtForm } from "../../_components/ArtForm";

type EditArtSearchParams = {
  error?: string;
  success?: string;
};

type EditArtPageProps = {
  params: Promise<{
    artSlug: string;
  }>;
  searchParams?: Promise<EditArtSearchParams>;
};

type EditArtFormContentProps = {
  params: Promise<{
    artSlug: string;
  }>;
  searchParams?: Promise<EditArtSearchParams>;
};

function EditArtFormFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading artwork</CardTitle>
        <CardDescription>Fetching your artwork details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-6">
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
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-36 rounded-md bg-muted" />
          </div>

          <div className="h-16 rounded-md bg-muted" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-10 w-full rounded-md bg-muted sm:w-36" />
            <div className="h-10 w-full rounded-md bg-muted sm:w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function EditArtFormContent({
  params,
  searchParams,
}: EditArtFormContentProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  return (
    <ArtForm
      mode="edit"
      artSlug={resolvedParams.artSlug}
      errorMessage={resolvedSearchParams.error ?? null}
      successMessage={resolvedSearchParams.success ?? null}
    />
  );
}

export default function Page({ params, searchParams }: EditArtPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit artwork</h1>
        <p className="text-sm text-muted-foreground">
          Update the title, slug, description, and visibility for this piece.
        </p>
      </div>
      <Suspense fallback={<EditArtFormFallback />}>
        <EditArtFormContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
