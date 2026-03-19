export interface Artist {
  id: number;
  user_id: string;
  slug: string;
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
  slug: string;
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
  slug?: string;
  name?: string;
  bio?: string | null;
  avatar_url?: string | null;
  etsy_link?: string | null;
  instagram_link?: string | null;
  website?: string | null;
  location?: string | null;
  is_public?: boolean;
}
