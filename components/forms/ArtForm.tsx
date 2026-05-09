import Image from "next/image";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

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
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";
import {
  getArtImagePublicUrl,
  createArt,
  deleteArtImage,
  getArtBySlug,
  updateArt,
  uploadArtImage,
} from "@/lib/queries/art";
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

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getStringValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function getImageFileValue(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getArtInput(formData: FormData): CreateArtInput {
  const title = getStringValue(formData, "title") ?? "";
  return {
    slug: titleToSlug(title),
    title,
    description: getStringValue(formData, "description"),
    is_public: formData.has("is_public"),
    instagram_url: getStringValue(formData, "instagram_url"),
    etsy_url: getStringValue(formData, "etsy_url"),
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
  const defaultTitle = art?.title ?? "";
  const defaultDescription = art?.description ?? "";
  const defaultIsPublic = art?.is_public ?? false;
  const defaultInstagramUrl = art?.instagram_url ?? "";
  const defaultEtsyUrl = art?.etsy_url ?? "";
  const currentImagePath = art?.image_path ?? null;
  const currentImageUrl = currentImagePath
    ? (() => {
        try {
          return getArtImagePublicUrl(currentImagePath);
        } catch {
          return null;
        }
      })()
    : null;

  const errorRedirectBasePath =
    mode === "create" ? "/art/add" : `/art/${currentSlug}/edit`;

  async function submitArt(formData: FormData) {
    "use server";

    const getErrorRedirectUrl = (message: string) =>
      `${errorRedirectBasePath}?error=${encodeURIComponent(message)}`;

    const baseInput = getArtInput(formData);
    const imageFile = getImageFileValue(formData, "image");
    const removeCurrentImage =
      mode === "edit" && currentImagePath
        ? formData.has("remove_image")
        : false;

    if (mode === "create") {
      let uploadedImagePath: string | null = null;
      let uploadedImageWidth: number | null = null;
      let uploadedImageHeight: number | null = null;

      if (imageFile) {
        try {
          const { image_path, image_width, image_height } =
            await uploadArtImage({
              file: imageFile,
              slug: baseInput.slug,
            });
          uploadedImagePath = image_path;
          uploadedImageWidth = image_width;
          uploadedImageHeight = image_height;
        } catch (error) {
          const message =
            error instanceof QueryError || error instanceof Error
              ? error.message
              : "Unable to upload image.";

          redirect(getErrorRedirectUrl(message));
        }
      }

      const input: CreateArtInput = {
        ...baseInput,
        image_path: uploadedImagePath,
        image_width: uploadedImageWidth,
        image_height: uploadedImageHeight,
      };
      const result = safeValidateCreateArtInput(input);

      if (!result.success) {
        if (uploadedImagePath) {
          try {
            await deleteArtImage(uploadedImagePath);
          } catch {
            // Best-effort cleanup for failed validation after upload.
          }
        }

        const message = result.error.issues[0]?.message ?? "Invalid art data.";
        redirect(getErrorRedirectUrl(message));
      }

      let createdArt;

      try {
        createdArt = await createArt(result.data);
      } catch (error) {
        if (uploadedImagePath) {
          try {
            await deleteArtImage(uploadedImagePath);
          } catch {
            // Best-effort cleanup for failed create after upload.
          }
        }

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

    let newImagePath: string | null = null;
    let newImageWidth: number | null = null;
    let newImageHeight: number | null = null;

    if (removeCurrentImage && imageFile) {
      redirect(
        getErrorRedirectUrl(
          "Choose either a new image upload or remove the current image.",
        ),
      );
    }

    if (imageFile) {
      try {
        const { image_path, image_width, image_height } = await uploadArtImage({
          file: imageFile,
          slug: baseInput.slug,
        });
        newImagePath = image_path;
        newImageWidth = image_width;
        newImageHeight = image_height;
      } catch (error) {
        const message =
          error instanceof QueryError || error instanceof Error
            ? error.message
            : "Unable to upload image.";

        redirect(getErrorRedirectUrl(message));
      }
    }

    const input = {
      ...baseInput,
      image_path: removeCurrentImage ? null : (newImagePath ?? undefined),
      image_width: removeCurrentImage ? null : (newImageWidth ?? undefined),
      image_height: removeCurrentImage ? null : (newImageHeight ?? undefined),
    };
    const result = safeValidateUpdateArtInput(input);

    if (!result.success) {
      if (newImagePath) {
        try {
          await deleteArtImage(newImagePath);
        } catch {
          // Best-effort cleanup for failed validation after upload.
        }
      }

      const message = result.error.issues[0]?.message ?? "Invalid art data.";
      redirect(getErrorRedirectUrl(message));
    }

    let updatedArt;

    try {
      updatedArt = await updateArt(artId!, result.data);
    } catch (error) {
      if (newImagePath) {
        try {
          await deleteArtImage(newImagePath);
        } catch {
          // Best-effort cleanup for failed update after upload.
        }
      }

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

    if (
      currentImagePath &&
      ((newImagePath && currentImagePath !== newImagePath) ||
        removeCurrentImage)
    ) {
      try {
        await deleteArtImage(currentImagePath);
      } catch {
        // Best-effort cleanup of replaced image.
      }
    }

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

          <div className="grid gap-2">
            <Label htmlFor="etsy_url">Etsy listing URL</Label>
            <Input
              id="etsy_url"
              name="etsy_url"
              type="url"
              placeholder="https://www.etsy.com/listing/..."
              defaultValue={defaultEtsyUrl}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Artwork image</Label>
            {mode === "edit" && currentImageUrl ? (
              <div className="relative h-56 w-full overflow-hidden rounded-xl">
                <Image
                  src={currentImageUrl}
                  alt={`${defaultTitle || "Artwork"} image`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 672px, 100vw"
                />
              </div>
            ) : null}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
            />
            {mode === "edit" && currentImagePath ? (
              <>
                <p className="text-xs text-muted-foreground">
                  A new upload will replace the current artwork image.
                </p>
                <label className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    name="remove_image"
                    className="h-4 w-4 rounded border-input"
                  />
                  Remove current image
                </label>
              </>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full sm:w-auto">
              {submitLabel}
            </Button>
            {mode === "edit" && currentSlug ? (
              <div className="w-full sm:w-auto sm:min-w-52">
                <SocialLinkButtons
                  actionLinks={[
                    {
                      label: "View artwork",
                      href: `/art/${currentSlug}`,
                      kind: "view-artwork",
                    },
                  ]}
                />
              </div>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
