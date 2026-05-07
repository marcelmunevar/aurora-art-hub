import type { Artist } from "@/types/artist";

export interface Art {
  id: number;
  artist_id: number;
  slug: string;
  title: string;
  description: string | null;
  is_public: boolean;
  instagram_url: string | null;
  etsy_url: string | null;
  image_path: string | null;
}

export interface CreateArtInput {
  slug: string;
  title: string;
  description?: string | null;
  is_public?: boolean;
  instagram_url?: string | null;
  etsy_url?: string | null;
  image_path?: string | null;
}

export interface PublicArt extends Art {
  artist: Pick<Artist, "id" | "name" | "slug"> | null;
}

export interface UpdateArtInput {
  slug?: string;
  title?: string;
  description?: string | null;
  is_public?: boolean;
  instagram_url?: string | null;
  etsy_url?: string | null;
  image_path?: string | null;
}
