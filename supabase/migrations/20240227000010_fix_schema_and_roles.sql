-- First, ensure we're working with the correct schema
SET search_path TO auth, public;

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for routing admins" ON public.drivers;
    DROP POLICY IF EXISTS "Enable write access for routing admins" ON public.drivers;
    DROP POLICY IF EXISTS "Enable read access for all admins" ON public.orders;
    DROP POLICY IF EXISTS "Enable write access for routing admins" ON public.orders;
    DROP POLICY IF EXISTS "Enable status updates for picking admins" ON public.orders;
    DROP POLICY IF EXISTS "Enable read access for routing admins" ON public.routes;
    DROP POLICY IF EXISTS "Enable write access for routing admins" ON public.routes;
EXCEPTION 
    WHEN undefined_object THEN NULL;
END $$;

-- Update user roles
UPDATE auth.users 
SET 
  role = 'ROUTING_ADMIN',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"ROUTING_ADMIN"'
  )
WHERE role NOT IN ('ROUTING_ADMIN', 'PICKING_ADMIN');

-- Recreate the role constraint
ALTER TABLE auth.users 
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE auth.users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ROUTING_ADMIN', 'PICKING_ADMIN'));

-- Create or update test users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  email,
  role,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_sent_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'routing@zenflow.com',
    'ROUTING_ADMIN',
    crypt('routing123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "ROUTING_ADMIN"}',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'picking@zenflow.com',
    'PICKING_ADMIN',
    crypt('picking123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "PICKING_ADMIN"}',
    now(),
    now(),
    now()
  )
ON CONFLICT (email) 
DO UPDATE SET 
  role = EXCLUDED.role,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  encrypted_password = EXCLUDED.encrypted_password;

-- Recreate policies with proper permissions
-- Drivers policies
CREATE POLICY "routing_admin_read_drivers" ON public.drivers
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "routing_admin_write_drivers" ON public.drivers
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

-- Orders policies
CREATE POLICY "all_admins_read_orders" ON public.orders
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' IN ('ROUTING_ADMIN', 'PICKING_ADMIN'));

CREATE POLICY "routing_admin_write_orders" ON public.orders
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "picking_admin_update_orders" ON public.orders
    FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'role' = 'PICKING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'PICKING_ADMIN');

-- Routes policies
CREATE POLICY "routing_admin_read_routes" ON public.routes
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

CREATE POLICY "routing_admin_write_routes" ON public.routes
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'ROUTING_ADMIN')
    WITH CHECK (auth.jwt() ->> 'role' = 'ROUTING_ADMIN');

-- Enable RLS on all tables
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;