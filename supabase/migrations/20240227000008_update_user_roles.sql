-- Update user roles enum
ALTER TABLE auth.users 
  DROP CONSTRAINT IF EXISTS users_role_check,
  ADD CONSTRAINT users_role_check CHECK (role IN ('ROUTING_ADMIN', 'PICKING_ADMIN'));

-- Update existing admin users to ROUTING_ADMIN
UPDATE auth.users 
SET 
  role = 'ROUTING_ADMIN',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"ROUTING_ADMIN"'
  )
WHERE role = 'ADMIN';

-- Create test users for each role if they don't exist
DO $$
BEGIN
    -- Routing Admin
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'routing@zenflow.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            email,
            role,
            encrypted_password,
            email_confirmed_at,
            confirmation_sent_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'routing@zenflow.com',
            'ROUTING_ADMIN',
            crypt('routing123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"role":"ROUTING_ADMIN"}'
        );
    END IF;

    -- Picking Admin
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'picking@zenflow.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            email,
            role,
            encrypted_password,
            email_confirmed_at,
            confirmation_sent_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'picking@zenflow.com',
            'PICKING_ADMIN',
            crypt('picking123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"role":"PICKING_ADMIN"}'
        );
    END IF;
END
$$;

-- Update RLS policies for each role
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON drivers;
    DROP POLICY IF EXISTS "Enable write access for admin users" ON drivers;
    DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON orders;
    DROP POLICY IF EXISTS "Enable write access for admin users" ON orders;
    DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON routes;
    DROP POLICY IF EXISTS "Enable write access for admin users" ON routes;
EXCEPTION 
    WHEN undefined_object THEN NULL;
END $$;

-- Create new policies for drivers
CREATE POLICY "Enable read access for routing admins" ON drivers
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "Enable write access for routing admins" ON drivers
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

-- Create new policies for orders
CREATE POLICY "Enable read access for all admins" ON orders
    FOR SELECT
    TO authenticated
    USING (
      auth.jwt() ->> 'role' IN ('ROUTING_ADMIN', 'PICKING_ADMIN')
    );

CREATE POLICY "Enable write access for routing admins" ON orders
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "Enable status updates for picking admins" ON orders
    FOR UPDATE
    TO authenticated
    USING (
      auth.jwt() ->> 'role' = 'PICKING_ADMIN' AND
      (OLD.status = 'PENDING' AND NEW.status IN ('IN_PROGRESS', 'COMPLETED'))
    )
    WITH CHECK (
      auth.jwt() ->> 'role' = 'PICKING_ADMIN' AND
      (OLD.status = 'PENDING' AND NEW.status IN ('IN_PROGRESS', 'COMPLETED'))
    );

-- Create new policies for routes
CREATE POLICY "Enable read access for routing admins" ON routes
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "Enable write access for routing admins" ON routes
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');