-- Update RLS policies to properly handle admin role
ALTER TABLE drivers DROP POLICY IF EXISTS "Enable read access for all users";
ALTER TABLE drivers DROP POLICY IF EXISTS "Enable insert for authenticated users";
ALTER TABLE drivers DROP POLICY IF EXISTS "Enable update for authenticated users";
ALTER TABLE drivers DROP POLICY IF EXISTS "Enable delete for authenticated users";

-- New policies for drivers
CREATE POLICY "Enable read access for all users" ON drivers
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for admin users" ON drivers
    USING (auth.jwt() ->> 'role' = 'ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ADMIN');

-- Similar policies for orders and routes
ALTER TABLE orders DROP POLICY IF EXISTS "Anyone can view orders";
ALTER TABLE orders DROP POLICY IF EXISTS "Users can create orders";
ALTER TABLE orders DROP POLICY IF EXISTS "Admin can manage orders";

CREATE POLICY "Enable read access for all users" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Enable create access for all authenticated users" ON orders
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable write access for admin users" ON orders
    USING (auth.jwt() ->> 'role' = 'ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ADMIN');

ALTER TABLE routes DROP POLICY IF EXISTS "Anyone can view routes";
ALTER TABLE routes DROP POLICY IF EXISTS "Admin can manage routes";

CREATE POLICY "Enable read access for all users" ON routes
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for admin users" ON routes
    USING (auth.jwt() ->> 'role' = 'ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ADMIN');