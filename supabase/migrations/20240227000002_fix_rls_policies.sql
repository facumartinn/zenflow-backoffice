-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view drivers" ON drivers;
DROP POLICY IF EXISTS "Admin can manage drivers" ON drivers;

-- Create new policies for drivers table
CREATE POLICY "Enable read access for all users" ON drivers
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON drivers
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON drivers
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON drivers
    FOR DELETE
    TO authenticated
    USING (true);

-- Update RLS settings
ALTER TABLE drivers FORCE ROW LEVEL SECURITY;