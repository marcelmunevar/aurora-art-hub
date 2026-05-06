import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArtForm } from "@/components/forms/ArtForm";

type AddArtSearchParams = {
  error?: string;
  success?: string;
};

type AddArtPageProps = {
  searchParams?: Promise<AddArtSearchParams>;
};

type AddArtFormContentProps = {
  searchParams?: Promise<AddArtSearchParams>;
};

async function AddArtFormContent({ searchParams }: AddArtFormContentProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  return (
    <ArtForm
      mode="create"
      errorMessage={resolvedSearchParams.error ?? null}
      successMessage={resolvedSearchParams.success ?? null}
    />
  );
}

function AddArtFormFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading art form</CardTitle>
        <CardDescription>Preparing your artwork form.</CardDescription>
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

          <div className="h-10 w-full rounded-md bg-muted sm:w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page({ searchParams }: AddArtPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Add artwork</h1>
        <p className="text-sm text-muted-foreground">
          Create a new artwork entry for your artist profile.
        </p>
      </div>
      <Suspense fallback={<AddArtFormFallback />}>
        <AddArtFormContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
