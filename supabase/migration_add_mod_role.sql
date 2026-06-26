-- Add mod role to the role constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (role IN ('user', 'mod', 'admin', 'owner'));

-- Create staff_chat table
CREATE TABLE IF NOT EXISTS staff_chat (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for staff_chat
CREATE INDEX IF NOT EXISTS idx_staff_chat_created_at ON staff_chat(created_at DESC);

-- Enable RLS on staff_chat
ALTER TABLE staff_chat ENABLE ROW LEVEL SECURITY;

-- Only staff can read chat
CREATE POLICY "Staff can read chat"
  ON staff_chat FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('mod', 'admin', 'owner')
    )
  );

-- Only staff can send messages
CREATE POLICY "Staff can send messages"
  ON staff_chat FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('mod', 'admin', 'owner')
    )
  );

-- Update RLS policies for projects to allow admins and mods to insert
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
CREATE POLICY "Staff can insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('mod', 'admin', 'owner')
    )
  );

-- Update RLS policies for projects to allow admins and mods to update
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Staff can update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('mod', 'admin', 'owner')
    )
  );
