-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Set search path
SET search_path TO auth, public;

-- Create auth users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id uuid,
    aud character varying(255),
    role character varying(255),
    email character varying(255) UNIQUE,
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    confirmation_sent_at timestamp with time zone
);

-- Drop and recreate role constraint
ALTER TABLE auth.users 
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE auth.users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ROUTING_ADMIN', 'PICKING_ADMIN'));

-- Create or update test users with proper encryption
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
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_role_idx ON auth.users (role);