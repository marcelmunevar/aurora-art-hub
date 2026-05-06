import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createArt, getArtBySlug, updateArt } from "@/lib/queries/art";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";
import {
  safeValidateCreateArtInput,
  safeValidateUpdateArtInput,
} from "@/lib/validation/art";
import type { CreateArtInput } from "@/types/art";

type BaseArtFormProps = {
  errorMessage?: string | null;
  successMessage?: string | null;
};

type CreateArtFormProps = BaseArtFormProps & {
  mode: "create";
};

type EditArtFormProps = BaseArtFormProps & {
  mode: "edit";
  artSlug: string;
};

type ArtFormProps = CreateArtFormProps | EditArtFormProps;

function getStringValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function getArtInput(formData: FormData): CreateArtInput {
  return {
    slug: getStringValue(formData, "slug") ?? "",
    title: getStringValue(formData, "title") ?? "",
    description: getStringValue(formData, "description"),
    is_public: formData.has("is_public"),
    instagram_url: getStringValue(formData, "instagram_url"),
  };
}

export async function ArtForm(props: ArtFormProps) {
  const { mode, errorMessage, successMessage } = props;
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
    redirect(
      `/artist/edit?error=${encodeURIComponent(
        `You must create an artist profile before ${
          mode === "create" ? "adding" : "editing"
        } art.`,
      )}`,
    );
  }

  const art = mode === "edit" ? await getArtBySlug(props.artSlug) : null;

  if (mode === "edit" && (!art || art.artist_id !== artist.id)) {
    notFound();
  }

  const artId = art?.id ?? null;
  const currentSlug = art?.slug ?? null;
  const artistSlug = artist.slug;
  const pageTitle = mode === "create" ? "Add artwork" : "Edit artwork";
  const pageDescription =
    mode === "create"
      ? "Create a new artwork entry for your artist profile."
      : "Update the artwork details shown across Aurora Art Hub.";
  const submitLabel = mode === "create" ? "Create artwork" : "Save artwork";
  const defaultSlug = art?.slug ?? "";
  const defaultTitle = art?.title ?? "";
  const defaultDescription = art?.description ?? "";
  const defaultIsPublic = art?.is_public ?? false;
  const defaultInstagramUrl = art?.instagram_url ?? "";
  const errorRedirectBasePath =
    mode === "create" ? "/art/add" : `/art/${currentSlug}/edit`;

  async function submitArt(formData: FormData) {
    "use server";

    const getErrorRedirectUrl = (message: string) =>
      `${errorRedirectBasePath}?error=${encodeURIComponent(message)}`;

    const input = getArtInput(formData);

    if (mode === "create") {
      const result = safeValidateCreateArtInput(input);

      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Invalid art data.";
        redirect(getErrorRedirectUrl(message));
      }

      let createdArt;

      try {
        createdArt = await createArt(result.data);
      } catch (error) {
        const message =
          error instanceof QueryError || error instanceof Error
            ? error.message
            : "Unable to create art.";

        redirect(getErrorRedirectUrl(message));
      }

      revalidatePath("/art");
      revalidatePath(`/artist/${artistSlug}`);
      revalidatePath(`/art/${createdArt.slug}`);
      revalidatePath(`/art/${createdArt.slug}/edit`);

      redirect(
        `/art/${createdArt.slug}/edit?success=${encodeURIComponent(
          "Art created.",
        )}`,
      );
    }

    const result = safeValidateUpdateArtInput(input);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid art data.";
      redirect(getErrorRedirectUrl(message));
    }

    let updatedArt;

    try {
      updatedArt = await updateArt(artId!, result.data);
    } catch (error) {
      const message =
        error instanceof QueryError || error instanceof Error
          ? error.message
          : "Unable to save art.";

      redirect(getErrorRedirectUrl(message));
    }

    revalidatePath("/art");
    revalidatePath(`/art/${currentSlug!}`);
    revalidatePath(`/art/${currentSlug!}/edit`);

    if (updatedArt.slug !== currentSlug) {
      revalidatePath(`/art/${updatedArt.slug}`);
    }

    revalidatePath(`/art/${updatedArt.slug}/edit`);
    revalidatePath(`/artist/${artistSlug}`);

    redirect(
      `/art/${updatedArt.slug}/edit?success=${encodeURIComponent(
        "Art updated.",
      )}`,
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
        <CardDescription>{pageDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submitArt} className="space-y-6">
          {errorMessage ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="aurora-study"
                defaultValue={defaultSlug}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Aurora Study"
                defaultValue={defaultTitle}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={8}
              defaultValue={defaultDescription}
              className="flex min-h-36 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe the materials, process, story, or inspiration behind this piece."
            />
          </div>

          <label className="flex items-start gap-3 rounded-md border p-4 text-sm">
            <input
              type="checkbox"
              name="is_public"
              defaultChecked={defaultIsPublic}
              className="mt-0.5 h-4 w-4 rounded border-input"
            />
            <span>
              <span className="block font-medium text-foreground">
                Public artwork
              </span>
              <span className="block text-muted-foreground">
                Allow this artwork to appear in public listings and profile
                views.
              </span>
            </span>
          </label>

          <div className="grid gap-2">
            <Label htmlFor="instagram_url">Instagram post URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              defaultValue={defaultInstagramUrl}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full sm:w-auto">
              {submitLabel}
            </Button>
            {mode === "edit" && currentSlug ? (
              <Button type="button" variant="outline" asChild>
                <Link href={`/art/${currentSlug}`}>View artwork</Link>
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
