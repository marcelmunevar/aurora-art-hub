export interface Art {
  id: number;
  artist_id: number;
  slug: string;
  title: string;
  description: string | null;
  is_public: boolean;
}

export interface CreateArtInput {
  slug: string;
  title: string;
  description?: string | null;
  is_public?: boolean;
}

export interface UpdateArtInput {
  slug?: string;
  title?: string;
  description?: string | null;
  is_public?: boolean;
}
