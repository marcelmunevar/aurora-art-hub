import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

type ProfileFormProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
  errorMessage?: string | null;
  successMessage?: string | null;
};

const EDIT_PATH = "/artist/edit";

function getStringValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function getArtistInput(formData: FormData) {
  return {
    slug: getStringValue(formData, "slug"),
    name: getStringValue(formData, "name"),
    bio: getStringValue(formData, "bio"),
    avatar_url: getStringValue(formData, "avatar_url"),
    etsy_link: getStringValue(formData, "etsy_link"),
    instagram_link: getStringValue(formData, "instagram_link"),
    website: getStringValue(formData, "website"),
    location: getStringValue(formData, "location"),
    is_public: formData.has("is_public"),
  };
}

export async function ProfileForm({
  searchParams,
  errorMessage,
  successMessage,
}: ProfileFormProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const resolvedErrorMessage =
    errorMessage ?? resolvedSearchParams.error ?? null;
  const resolvedSuccessMessage =
    successMessage ?? resolvedSearchParams.success ?? null;

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

  async function submitProfile(formData: FormData) {
    "use server";

    const input = getArtistInput(formData);

    if (artistId) {
      const result = safeValidateUpdateArtistInput(input);

      if (!result.success) {
        const message =
          result.error.issues[0]?.message ?? "Invalid profile data.";
        redirect(`${EDIT_PATH}?error=${encodeURIComponent(message)}`);
      }

      let updatedArtist;

      try {
        updatedArtist = await updateArtist(artistId, result.data);
      } catch (error) {
        const message =
          error instanceof QueryError || error instanceof Error
            ? error.message
            : "Unable to save profile.";

        redirect(`${EDIT_PATH}?error=${encodeURIComponent(message)}`);
      }

      revalidatePath(`/artist/${updatedArtist.slug}`);
      revalidatePath(EDIT_PATH);

      if (artist?.slug && artist.slug !== updatedArtist.slug) {
        revalidatePath(`/artist/${artist.slug}`);
      }

      redirect(
        `${EDIT_PATH}?success=${encodeURIComponent("Profile updated.")}`,
      );
    }

    const result = safeValidateCreateArtistInput(input);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Invalid profile data.";
      redirect(`${EDIT_PATH}?error=${encodeURIComponent(message)}`);
    }

    let createdArtist;

    try {
      createdArtist = await createArtist(result.data);
    } catch (error) {
      const message =
        error instanceof QueryError || error instanceof Error
          ? error.message
          : "Unable to save profile.";

      redirect(`${EDIT_PATH}?error=${encodeURIComponent(message)}`);
    }

    revalidatePath(`/artist/${createdArtist.slug}`);
    revalidatePath(EDIT_PATH);

    redirect(`${EDIT_PATH}?success=${encodeURIComponent("Profile created.")}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {artist ? "Edit your profile" : "Create your profile"}
        </CardTitle>
        <CardDescription>
          Manage the public artist profile shown on your artist page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submitProfile} className="space-y-6">
          {resolvedErrorMessage ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {resolvedErrorMessage}
            </div>
          ) : null}

          {resolvedSuccessMessage ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {resolvedSuccessMessage}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="marcel-studio"
                defaultValue={artist?.slug ?? ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Marcel Studio"
                defaultValue={artist?.name ?? ""}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              rows={6}
              defaultValue={artist?.bio ?? ""}
              className="flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Write a short introduction about your work and practice."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                defaultValue={artist?.avatar_url ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Detroit, MI"
                defaultValue={artist?.location ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourstudio.com"
                defaultValue={artist?.website ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instagram_link">Instagram</Label>
              <Input
                id="instagram_link"
                name="instagram_link"
                type="url"
                placeholder="https://instagram.com/yourhandle"
                defaultValue={artist?.instagram_link ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="etsy_link">Etsy</Label>
              <Input
                id="etsy_link"
                name="etsy_link"
                type="url"
                placeholder="https://etsy.com/shop/yourshop"
                defaultValue={artist?.etsy_link ?? ""}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-md border p-4 text-sm">
            <input
              type="checkbox"
              name="is_public"
              defaultChecked={artist?.is_public ?? false}
              className="mt-0.5 h-4 w-4 rounded border-input"
            />
            <span>
              <span className="block font-medium text-foreground">
                Public profile
              </span>
              <span className="block text-muted-foreground">
                Allow your artist page to appear in public listings.
              </span>
            </span>
          </label>

          <Button type="submit" className="w-full md:w-auto">
            {artist ? "Save profile" : "Create profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
