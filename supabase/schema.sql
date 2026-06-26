-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  category TEXT NOT NULL CHECK (category IN ('Projects', 'Packages', 'Assets', 'Scripts')),
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  download_url TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT false,
  seasonal_theme TEXT
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  is_boosted BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'mod', 'admin', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_is_private ON projects(is_private);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_likes ON projects(likes DESC);
CREATE INDEX idx_projects_downloads ON projects(downloads DESC);
CREATE INDEX idx_user_profiles_discord_id ON user_profiles(discord_id);
CREATE INDEX idx_user_profiles_is_boosted ON user_profiles(is_boosted);

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_views(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET views = views + 1 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET downloads = downloads + 1 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET likes = likes + 1 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read non-private projects
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  USING (is_private = false);

-- Only authenticated users can read private projects
CREATE POLICY "Private projects are viewable by boosted users"
  ON projects FOR SELECT
  USING (
    is_private = true AND 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_boosted = true
    )
  );

-- Only authenticated users can insert projects (admin would need additional checks)
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only project owners or admins can update projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only owners can delete projects
CREATE POLICY "Only owners can delete projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'owner'
    )
  );

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
