-- Update category constraint to new categories
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD CONSTRAINT projects_category_check CHECK (category IN ('Projects', 'Packages', 'Assets', 'Scripts'));

-- Update existing data to match new categories
UPDATE projects SET category = 'Projects' WHERE category IN ('Full Copy', 'Mod Menu');
UPDATE projects SET category = 'Packages' WHERE category = 'Map Pack';
UPDATE projects SET category = 'Scripts' WHERE category = 'Script';
-- Assets stays the same
