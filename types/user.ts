export interface UserMetadata {
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  raw_user_meta_data: UserMetadata | null;
}
