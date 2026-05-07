import "server-only";

import {
  createConflictQueryError,
  createNotFoundQueryError,
  createPostgrestQueryError,
  createUnauthorizedQueryError,
  QueryError,
} from "./errors";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import type {
  Art,
  CreateArtInput,
  PublicArt,
  UpdateArtInput,
} from "@/types/art";

const ART_COLUMNS =
  "id, artist_id, slug, title, description, is_public, instagram_url, etsy_url, image_path";
const PUBLIC_ART_COLUMNS = `${ART_COLUMNS}, artist:artist_id(id, name, slug)`;
const ART_IMAGES_BUCKET = "art-images";
const ALLOWED_ART_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_ART_IMAGE_BYTES = 5 * 1024 * 1024;

type UploadArtImageInput = {
  file: File;
  slug: string;
};

type UploadedArtImage = {
  image_path: string;
};

function sanitizeFileSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function getFileExtensionFromMimeType(mimeType: string): string | null {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return null;
}

function assertValidArtImage(file: File) {
  if (!ALLOWED_ART_IMAGE_TYPES.has(file.type)) {
    throw new QueryError("Image must be a JPG, PNG, or WEBP file.", {
      code: "INVALID_IMAGE_TYPE",
      status: 400,
    });
  }

  if (file.size > MAX_ART_IMAGE_BYTES) {
    throw new QueryError("Image must be 5MB or smaller.", {
      code: "IMAGE_TOO_LARGE",
      status: 400,
    });
  }
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    throw new QueryError("Failed to fetch authenticated user.", {
      code: "AUTH_ERROR",
      status: 401,
    });
  }

  const userId = data?.claims?.sub;

  if (!userId) {
    throw createUnauthorizedQueryError(
      "You must be signed in to perform this action.",
    );
  }

  return userId;
}

type PublicArtRow = Omit<PublicArt, "artist"> & {
  artist:
    | NonNullable<PublicArt["artist"]>
    | NonNullable<PublicArt["artist"]>[]
    | null;
};

function normalizeEmbeddedArtist(
  artist: PublicArtRow["artist"],
): PublicArt["artist"] {
  if (Array.isArray(artist)) {
    return artist[0] ?? null;
  }

  return artist ?? null;
}

async function getCurrentUserArtistId(): Promise<number> {
  const artist = await getCurrentUserArtist();

  if (!artist) {
    throw createUnauthorizedQueryError(
      "You must have an artist profile before creating art.",
    );
  }

  return artist.id;
}

export async function getArtById(id: number): Promise<Art | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(ART_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError("Failed to fetch art by id.", error);
  }

  return data as Art | null;
}

export async function getArtBySlug(slug: string): Promise<Art | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(ART_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError("Failed to fetch art by slug.", error);
  }

  return data as Art | null;
}

export async function getArtsByArtistId(artistId: number): Promise<Art[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(ART_COLUMNS)
    .eq("artist_id", artistId)
    .order("id", { ascending: false });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch art by artist.", error);
  }

  return (data ?? []) as Art[];
}

export async function getCurrentUserArt(): Promise<Art[]> {
  const supabase = await createClient();
  const artistId = await getCurrentUserArtistId();

  const { data, error } = await supabase
    .from("art")
    .select(ART_COLUMNS)
    .eq("artist_id", artistId)
    .order("id", { ascending: false });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch current user art.", error);
  }

  return (data ?? []) as Art[];
}

export async function getPublicArt(): Promise<PublicArt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(PUBLIC_ART_COLUMNS)
    .eq("is_public", true)
    .order("id", { ascending: false });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch public art.", error);
  }

  return ((data ?? []) as PublicArtRow[]).map(({ artist, ...art }) => ({
    ...art,
    artist: normalizeEmbeddedArtist(artist),
  }));
}

export async function getPrivateArt(): Promise<PublicArt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(PUBLIC_ART_COLUMNS)
    .eq("is_public", false)
    .order("id", { ascending: false });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch public art.", error);
  }

  return ((data ?? []) as PublicArtRow[]).map(({ artist, ...art }) => ({
    ...art,
    artist: normalizeEmbeddedArtist(artist),
  }));
}

export async function createArt(input: CreateArtInput): Promise<Art> {
  const supabase = await createClient();
  const artistId = await getCurrentUserArtistId();

  const { data, error } = await supabase
    .from("art")
    .insert({ ...input, artist_id: artistId })
    .select(ART_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw createConflictQueryError(
        "An artwork with that title already exists. Please use a different title.",
      );
    }

    throw createPostgrestQueryError("Failed to create art.", error);
  }

  return data as Art;
}

export async function updateArt(
  id: number,
  input: UpdateArtInput,
): Promise<Art> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .update(input)
    .eq("id", id)
    .select(ART_COLUMNS)
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw createConflictQueryError(
        "An artwork with that title already exists. Please use a different title.",
      );
    }

    throw createPostgrestQueryError("Failed to update art.", error);
  }

  if (!data) {
    throw createNotFoundQueryError("Art not found or not accessible.");
  }

  return data as Art;
}

export async function deleteArt(id: number): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError("Failed to delete art.", error);
  }

  if (!data) {
    throw createNotFoundQueryError("Art not found or not accessible.");
  }
}

export async function uploadArtImage({
  file,
  slug,
}: UploadArtImageInput): Promise<UploadedArtImage> {
  assertValidArtImage(file);

  const [supabase, userId] = await Promise.all([
    createClient(),
    getAuthenticatedUserId(),
  ]);

  const sanitizedSlug = sanitizeFileSegment(slug) || "art";
  const extension = getFileExtensionFromMimeType(file.type);

  if (!extension) {
    throw new QueryError("Unsupported image type.", {
      code: "INVALID_IMAGE_TYPE",
      status: 400,
    });
  }

  const imagePath = `${userId}/art/${sanitizedSlug}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(ART_IMAGES_BUCKET)
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new QueryError("Failed to upload artwork image.", {
      code: error.name,
      details: error.message,
      status: 500,
    });
  }

  return {
    image_path: imagePath,
  };
}

export async function deleteArtImage(imagePath: string): Promise<void> {
  const [supabase, userId] = await Promise.all([
    createClient(),
    getAuthenticatedUserId(),
  ]);

  if (!imagePath.startsWith(`${userId}/`)) {
    throw createUnauthorizedQueryError(
      "You are not allowed to delete this artwork image.",
    );
  }

  const { error } = await supabase.storage
    .from(ART_IMAGES_BUCKET)
    .remove([imagePath]);

  if (error) {
    throw new QueryError("Failed to delete artwork image.", {
      code: error.name,
      details: error.message,
      status: 500,
    });
  }
}

export function getArtImagePublicUrl(imagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new QueryError(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable.",
      {
        code: "MISSING_ENV",
        status: 500,
      },
    );
  }

  return `${supabaseUrl}/storage/v1/object/public/${ART_IMAGES_BUCKET}/${imagePath}`;
}
