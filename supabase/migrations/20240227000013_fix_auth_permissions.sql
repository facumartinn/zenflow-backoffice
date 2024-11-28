-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure auth schema exists and has proper permissions
CREATE SCHEMA IF NOT EXISTS auth;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, anon, authenticated;

-- Create auth schema tables if they don't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id uuid,
    aud character varying(255),
    role character varying(255),
    email character varying(255) UNIQUE,
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(255),
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(255),
    phone_change_token character varying(255),
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current character varying(255),
    email_change_confirm_status smallint,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255),
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);

-- Create identities table
CREATE TABLE IF NOT EXISTS auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED,
    CONSTRAINT identities_pkey PRIMARY KEY (provider, id),
    CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create instances table
CREATE TABLE IF NOT EXISTS auth.instances (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT instances_pkey PRIMARY KEY (id)
);

-- Create refresh tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    instance_id uuid,
    id bigserial PRIMARY KEY,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);

-- Create schema migrations table
CREATE TABLE IF NOT EXISTS auth.schema_migrations (
    version character varying(255) NOT NULL PRIMARY KEY
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS auth.sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal character varying(255),
    not_after timestamp with time zone,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA auth TO authenticated, anon, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO authenticated, anon, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO authenticated, anon, service_role;

-- Update or create RLS policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Allow public registration
CREATE OR REPLACE POLICY "Enable registration for all" ON auth.users
    FOR INSERT
    WITH CHECK (true);

-- Allow users to read their own data
CREATE OR REPLACE POLICY "Users can read own data" ON auth.users
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own data
CREATE OR REPLACE POLICY "Users can update own data" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_idx ON auth.refresh_tokens(instance_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens(instance_id, user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON auth.identities(user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Set default role for new users
  NEW.role := COALESCE(NEW.role, 'ROUTING_ADMIN');
  
  -- Set default metadata
  NEW.raw_user_meta_data := COALESCE(NEW.raw_user_meta_data, '{}');
  NEW.raw_user_meta_data := jsonb_set(
    NEW.raw_user_meta_data,
    '{role}',
    to_jsonb(NEW.role)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.handle_new_user();