export interface Artist {
  id: number;
  user_id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  etsy_link: string | null;
  instagram_link: string | null;
  website: string | null;
  location: string | null;
  is_public: boolean;
}

export interface CreateArtistInput {
  user_id: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  etsy_link?: string | null;
  instagram_link?: string | null;
  website?: string | null;
  location?: string | null;
  is_public?: boolean;
}

export interface UpdateArtistInput {
  name?: string;
  bio?: string | null;
  avatar_url?: string | null;
  etsy_link?: string | null;
  instagram_link?: string | null;
  website?: string | null;
  location?: string | null;
  is_public?: boolean;
}
