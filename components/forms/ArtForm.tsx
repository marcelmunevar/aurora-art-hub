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
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    redbubble_url: getStringValue(formData, "redbubble_url"),
  };
}

import ArtFormFields from "./ArtFormFields";

export async function ArtForm(props: ArtFormProps) {
  const { mode, successMessage } = props;
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
  const defaultRedbubbleUrl = art?.redbubble_url ?? "";
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

  async function submitArt(
    _prevState: { error: string | null },
    formData: FormData,
  ): Promise<{ error: string | null }> {
    "use server";

    const baseInput = getArtInput(formData);
    const imageFile = getImageFileValue(formData, "image");
    const removeCurrentImage =
      mode === "edit" && currentImagePath
        ? formData.has("remove_image")
        : false;

    // Server-side presence checks for required fields to provide clear errors
    if (!baseInput.title || baseInput.title.trim().length === 0) {
      return { error: "Title is required." };
    }

    if (!baseInput.description || baseInput.description.trim().length === 0) {
      return { error: "Description is required." };
    }

    const hasSocial = !!(baseInput.instagram_url || baseInput.etsy_url);
    if (!hasSocial) {
      return { error: "Provide at least one social link: Instagram or Etsy." };
    }

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

          return { error: message };
        }
      }

      const input: CreateArtInput = {
        ...baseInput,
        image_path: uploadedImagePath,
        image_width: uploadedImageWidth,
        image_height: uploadedImageHeight,
      };
      if (!uploadedImagePath) {
        return { error: "Image is required." };
      }
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
        return { error: message };
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

        return { error: message };
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
      return {
        error: "Choose either a new image upload or remove the current image.",
      };
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

        return { error: message };
      }
    }

    // For edit: ensure an image will exist after the update (either keep, replace, or error)
    if (mode === "edit") {
      const willHaveImage = !removeCurrentImage
        ? (currentImagePath ?? !!newImagePath)
        : !!newImagePath;

      if (!willHaveImage) {
        return { error: "Image is required." };
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
      return { error: message };
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

      return { error: message };
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
      `/art/${updatedArt.slug}/edit?success=${encodeURIComponent("Art updated.")}`,
    );
    // Unreachable: successful update redirects the user.
    return { error: null };
  }
  return (
    <ArtFormFields
      mode={mode}
      submitAction={submitArt}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      submitLabel={submitLabel}
      successMessage={successMessage ?? null}
      defaultTitle={defaultTitle}
      defaultDescription={defaultDescription}
      defaultIsPublic={defaultIsPublic}
      defaultInstagramUrl={defaultInstagramUrl}
      defaultEtsyUrl={defaultEtsyUrl}
      defaultRedbubbleUrl={defaultRedbubbleUrl}
      currentImageUrl={currentImageUrl}
      currentImagePath={currentImagePath}
    />
  );
}
