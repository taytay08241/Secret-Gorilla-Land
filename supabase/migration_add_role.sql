-- Add role column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner'));

-- Add index for role
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Only owners can delete projects" ON projects;

-- Add delete policy for owners only
CREATE POLICY "Only owners can delete projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'owner'
    )
  );
