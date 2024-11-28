-- Enable the pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, ensure we're working with the correct schema
SET search_path TO auth, public;

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