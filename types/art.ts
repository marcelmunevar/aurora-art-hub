export interface Art {
  id: number;
  artist_id: number;
  title: string;
  description: string | null;
  is_public: boolean;
}

export interface CreateArtInput {
  artist_id: number;
  title: string;
  description?: string | null;
  is_public?: boolean;
}

export interface UpdateArtInput {
  title?: string;
  description?: string | null;
  is_public?: boolean;
}
