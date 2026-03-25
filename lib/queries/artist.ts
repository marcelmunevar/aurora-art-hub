import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  createAuthQueryError,
  createConflictQueryError,
  createNotFoundQueryError,
  createPostgrestQueryError,
  createUnauthorizedQueryError,
} from "./errors";
import type {
  Artist,
  CreateArtistInput,
  UpdateArtistInput,
} from "@/types/artist";

const ARTIST_COLUMNS =
  "id, user_id, slug, name, bio, avatar_url, etsy_link, instagram_link, website, location, is_public";

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw createAuthQueryError("Failed to fetch authenticated user.", error);
  }

  if (!user) {
    throw createUnauthorizedQueryError(
      "You must be signed in to perform this action.",
    );
  }

  return user.id;
}

export async function getArtistById(id: number): Promise<Artist | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .select(ARTIST_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError("Failed to fetch artist by id.", error);
  }

  return data as Artist | null;
}

export async function getArtistBySlug(
  slug: string,
): Promise<Artist | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .select(ARTIST_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError("Failed to fetch artist by slug.", error);
  }

  return data as Artist | null;
}

export async function getArtistByUserId(
  userId: string,
): Promise<Artist | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .select(ARTIST_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw createPostgrestQueryError(
      "Failed to fetch artist by user id.",
      error,
    );
  }

  return data as Artist | null;
}

export async function getCurrentUserArtist(): Promise<Artist | null> {
  const userId = await getAuthenticatedUserId();
  return getArtistByUserId(userId);
}

export async function getPublicArtists(): Promise<Artist[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .select(ARTIST_COLUMNS)
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch public artists.", error);
  }

  return (data ?? []) as Artist[];
}

export async function createArtist(input: CreateArtistInput): Promise<Artist> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("artist")
    .insert({ ...input, user_id: userId })
    .select(ARTIST_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw createConflictQueryError(
        "An artist profile already exists for this user or slug.",
      );
    }

    throw createPostgrestQueryError("Failed to create artist.", error);
  }

  return data as Artist;
}

export async function updateArtist(
  id: number,
  input: UpdateArtistInput,
): Promise<Artist> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .update(input)
    .eq("id", id)
    .select(ARTIST_COLUMNS)
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw createConflictQueryError("That artist slug is already in use.");
    }

    throw createPostgrestQueryError("Failed to update artist.", error);
  }

  if (!data) {
    throw createNotFoundQueryError("Artist not found or not accessible.");
  }

  return data as Artist;
}

export async function deleteArtist(id: number): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23503") {
      throw createConflictQueryError(
        "Delete artist failed because related art still exists.",
      );
    }

    throw createPostgrestQueryError("Failed to delete artist.", error);
  }

  if (!data) {
    throw createNotFoundQueryError("Artist not found or not accessible.");
  }
}
