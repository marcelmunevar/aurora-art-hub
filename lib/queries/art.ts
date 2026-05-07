import "server-only";

import { Buffer } from "node:buffer";

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
  "id, artist_id, slug, title, description, is_public, instagram_url, etsy_url, image_path, image_width, image_height";
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
  image_width: number;
  image_height: number;
};

async function getImageDimensions(file: File): Promise<{
  width: number;
  height: number;
}> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dimensions = parseImageDimensions(buffer, file.type);

  if (!dimensions) {
    throw new QueryError("Unable to determine uploaded image dimensions.", {
      code: "INVALID_IMAGE_METADATA",
      status: 400,
    });
  }

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
}

function parseImageDimensions(
  buffer: Buffer,
  mimeType: string,
): { width: number; height: number } | null {
  if (mimeType === "image/png") {
    return parsePngDimensions(buffer);
  }

  if (mimeType === "image/jpeg") {
    return parseJpegDimensions(buffer);
  }

  if (mimeType === "image/webp") {
    return parseWebpDimensions(buffer);
  }

  return null;
}

function parsePngDimensions(
  buffer: Buffer,
): { width: number; height: number } | null {
  if (buffer.length < 24) {
    return null;
  }

  const signature = buffer.subarray(0, 8);
  const pngSignature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  if (!signature.equals(pngSignature)) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function parseJpegDimensions(
  buffer: Buffer,
): { width: number; height: number } | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    const blockLength = buffer.readUInt16BE(offset + 2);

    if (blockLength < 2 || offset + 2 + blockLength > buffer.length) {
      return null;
    }

    const isSofMarker =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isSofMarker) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + blockLength;
  }

  return null;
}

function parseWebpDimensions(
  buffer: Buffer,
): { width: number; height: number } | null {
  if (buffer.length < 30) {
    return null;
  }

  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }

  const chunkType = buffer.toString("ascii", 12, 16);

  if (chunkType === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }

  if (chunkType === "VP8 " && buffer.length >= 30) {
    const startCodeOk =
      buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a;

    if (!startCodeOk) {
      return null;
    }

    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunkType === "VP8L" && buffer.length >= 25) {
    if (buffer[20] !== 0x2f) {
      return null;
    }

    const b0 = buffer[21];
    const b1 = buffer[22];
    const b2 = buffer[23];
    const b3 = buffer[24];

    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height =
      1 + ((((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) >>> 0);

    return { width, height };
  }

  return null;
}

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
  const { width, height } = await getImageDimensions(file);

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
    image_width: width,
    image_height: height,
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
