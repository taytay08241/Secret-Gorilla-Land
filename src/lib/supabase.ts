import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string;
          description: string;
          version: string;
          category: string;
          images: string[];
          thumbnail: string;
          download_url: string;
          downloads: number;
          likes: number;
          views: number;
          comments: number;
          created_at: string;
          tags: string[];
          is_private: boolean;
          seasonal_theme: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle: string;
          description: string;
          version: string;
          category: string;
          images: string[];
          thumbnail: string;
          download_url: string;
          downloads?: number;
          likes?: number;
          views?: number;
          comments?: number;
          created_at?: string;
          tags: string[];
          is_private: boolean;
          seasonal_theme?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string;
          description?: string;
          version?: string;
          category?: string;
          images?: string[];
          thumbnail?: string;
          download_url?: string;
          downloads?: number;
          likes?: number;
          views?: number;
          comments?: number;
          created_at?: string;
          tags?: string[];
          is_private?: boolean;
          seasonal_theme?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          discord_id: string;
          username: string;
          avatar_url: string | null;
          is_boosted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          discord_id: string;
          username: string;
          avatar_url?: string | null;
          is_boosted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          discord_id?: string;
          username?: string;
          avatar_url?: string | null;
          is_boosted?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
