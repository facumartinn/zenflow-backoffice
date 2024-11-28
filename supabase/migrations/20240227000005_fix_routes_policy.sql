-- Drop existing policies for routes table
DROP POLICY IF EXISTS "Enable read access for all users" ON routes;
DROP POLICY IF EXISTS "Enable write access for admin users" ON routes;
DROP POLICY IF EXISTS "Anyone can view routes" ON routes;
DROP POLICY IF EXISTS "Admin can manage routes" ON routes;

-- Create new policies for routes table
CREATE POLICY "Enable read access for all authenticated users" ON routes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON routes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON routes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON routes
    FOR DELETE
    TO authenticated
    USING (true);