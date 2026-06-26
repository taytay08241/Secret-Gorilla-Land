export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  version: string;
  category: 'Projects' | 'Packages' | 'Assets' | 'Scripts';
  images: string[];
  thumbnail: string;
  download_url: string;
  stats: {
    downloads: number;
    likes: number;
    views: number;
    comments: number;
  };
  created_at: string;
  tags: string[];
  is_private: boolean;
  seasonal_theme?: string;
}

export interface UserProfile {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  is_boosted: boolean;
  role: 'user' | 'mod' | 'admin' | 'owner';
  created_at: string;
}

export interface FilterOptions {
  category?: string;
  sort?: 'newest' | 'trending' | 'most_downloaded' | 'most_liked';
  search?: string;
  is_private?: boolean;
}
