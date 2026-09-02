import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { QueryError } from "@/lib/queries/errors";
import {
  createArtist,
  getCurrentUserArtist,
  updateArtist,
} from "@/lib/queries/artist";
import type { Artist } from "@/types/artist";
import {
  safeValidateCreateArtistInput,
  safeValidateUpdateArtistInput,
} from "@/lib/validation/artist";
import ProfileFormFields from "@/components/forms/ProfileFormFields";

type ProfileFormProps = {
  successMessage?: string | null;
};

const EDIT_PATH = "/artist/edit";

function nameToSlug(name: string): string {
  return name
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

function getArtistInput(formData: FormData) {
  const name = getStringValue(formData, "name");
  return {
    slug: name ? nameToSlug(name) : undefined,
    name,
    bio: getStringValue(formData, "bio"),
    etsy_link: getStringValue(formData, "etsy_link"),
    instagram_link: getStringValue(formData, "instagram_link"),
    redbubble_link: getStringValue(formData, "redbubble_link"),
    website: getStringValue(formData, "website"),
    location: getStringValue(formData, "location"),
    is_public: formData.has("is_public"),
  };
}

export async function ProfileForm({ successMessage }: ProfileFormProps) {
  let artist: Artist | null;

  try {
    artist = await getCurrentUserArtist();
  } catch (error) {
    if (error instanceof QueryError && error.code === "UNAUTHORIZED") {
      redirect("/auth/login");
    }

    throw error;
  }

  const artistId = artist?.id ?? null;
  const previousSlug = artist?.slug ?? null;
  const pageTitle = artist ? "Edit your profile" : "Create your profile";
  const pageDescription =
    "Manage the public artist profile shown on your artist page.";
  const submitLabel = artist ? "Save profile" : "Create profile";

  async function submitProfile(
    _prevState: { error: string | null },
    formData: FormData,
  ): Promise<{ error: string | null }> {
    "use server";

    const input = getArtistInput(formData);

    if (!input.name || input.name.trim().length === 0) {
      return { error: "Name is required." };
    }

    if (!input.bio || input.bio.trim().length === 0) {
      return { error: "Bio is required." };
    }

    if (!input.location || input.location.trim().length === 0) {
      return { error: "Location is required." };
    }

    const hasSocial = !!(input.instagram_link || input.etsy_link);
    if (!hasSocial) {
      return { error: "Provide at least one social link: Instagram or Etsy." };
    }

    if (artistId) {
      const result = safeValidateUpdateArtistInput(input);

      if (!result.success) {
        const message =
          result.error.issues[0]?.message ?? "Invalid profile data.";
        return { error: message };
      }

      let updatedArtist;

      try {
        updatedArtist = await updateArtist(artistId, result.data);
      } catch (error) {
        const message =
          error instanceof QueryError || error instanceof Error
            ? error.message
            : "Unable to save profile.";

        return { error: message };
      }

      revalidatePath(`/artist/${updatedArtist.slug}`);
      revalidatePath(EDIT_PATH);

      if (previousSlug && previousSlug !== updatedArtist.slug) {
        revalidatePath(`/artist/${previousSlug}`);
      }

      redirect(
        `${EDIT_PATH}?success=${encodeURIComponent("Profile updated.")}`,
      );
      return { error: null };
    }

    const result = safeValidateCreateArtistInput(input);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Invalid profile data.";
      return { error: message };
    }

    let createdArtist;

    try {
      createdArtist = await createArtist(result.data);
    } catch (error) {
      const message =
        error instanceof QueryError || error instanceof Error
          ? error.message
          : "Unable to save profile.";

      return { error: message };
    }

    revalidatePath(`/artist/${createdArtist.slug}`);
    revalidatePath(EDIT_PATH);

    redirect(`${EDIT_PATH}?success=${encodeURIComponent("Profile created.")}`);
    return { error: null };
  }

  return (
    <ProfileFormFields
      submitAction={submitProfile}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      submitLabel={submitLabel}
      successMessage={successMessage ?? null}
      defaultName={artist?.name ?? ""}
      defaultBio={artist?.bio ?? ""}
      defaultLocation={artist?.location ?? ""}
      defaultWebsite={artist?.website ?? ""}
      defaultInstagramLink={artist?.instagram_link ?? ""}
      defaultEtsyLink={artist?.etsy_link ?? ""}
      defaultRedbubbleLink={artist?.redbubble_link ?? ""}
      defaultIsPublic={artist?.is_public ?? false}
    />
  );
}
