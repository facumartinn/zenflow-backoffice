-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON routes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON routes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON routes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON routes;

-- Create new policies for routes with proper joins
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

-- Update orders policies to ensure proper access
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable create access for all authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable write access for admin users" ON orders;

CREATE POLICY "Enable read access for all authenticated users" ON orders
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON orders
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON orders
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON orders
    FOR DELETE
    TO authenticated
    USING (true);

-- Ensure proper access to drivers table
DROP POLICY IF EXISTS "Enable read access for all users" ON drivers;
DROP POLICY IF EXISTS "Enable write access for admin users" ON drivers;

CREATE POLICY "Enable read access for all authenticated users" ON drivers
    FOR SELECT
    TO authenticated
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