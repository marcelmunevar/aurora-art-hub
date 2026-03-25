import "server-only";

import {
  createNotFoundQueryError,
  createPostgrestQueryError,
  createUnauthorizedQueryError,
} from "./errors";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import type { Art, CreateArtInput, UpdateArtInput } from "@/types/art";

const ART_COLUMNS = "id, artist_id, slug, title, description, is_public";

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

export async function getPublicArt(): Promise<Art[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("art")
    .select(ART_COLUMNS)
    .eq("is_public", true)
    .order("id", { ascending: false });

  if (error) {
    throw createPostgrestQueryError("Failed to fetch public art.", error);
  }

  return (data ?? []) as Art[];
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
