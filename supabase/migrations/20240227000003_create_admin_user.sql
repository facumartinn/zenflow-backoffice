-- Create admin user with role
INSERT INTO auth.users (
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
  'admin@zenflow.com',
  'ADMIN',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"ADMIN"}'
)
ON CONFLICT (email) DO UPDATE
SET 
  role = 'ADMIN',
  raw_user_meta_data = '{"role":"ADMIN"}';

-- Grant admin role permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'admin_role'
  ) THEN
    CREATE ROLE admin_role;
  END IF;
END
$$;

GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO admin_role;

-- Ensure the admin user has the admin_role
GRANT admin_role TO authenticated;