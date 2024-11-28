import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function setupSupabase() {
  try {
    // Create supabase directory if it doesn't exist
    if (!existsSync('supabase')) {
      mkdirSync('supabase');
      mkdirSync('supabase/migrations');
    }

    // Write migration file
    const migrationPath = join('supabase', 'migrations', '20240227000000_initial_schema.sql');
    if (!existsSync(migrationPath)) {
      writeFileSync(migrationPath, MIGRATION_SQL);
    }

    // Initialize Supabase project
    console.log('Initializing Supabase project...');
    execSync('npx supabase init', { stdio: 'inherit' });

    // Link to remote project
    console.log('Linking to remote Supabase project...');
    execSync('npx supabase link --project-ref dnncbdnpsbgpyazanjtu', { stdio: 'inherit' });

    // Push migration
    console.log('Pushing migration to Supabase...');
    execSync('npx supabase db push', { stdio: 'inherit' });

    console.log('Supabase setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    process.exit(1);
  }
}

const MIGRATION_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  full_name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY'))
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  products JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  route_id UUID REFERENCES routes(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_orders_route_id ON orders(route_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Users policies
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data'
  ) THEN
    CREATE POLICY "Users can view their own data" ON users
      FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Drivers policies
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Anyone can view drivers'
  ) THEN
    CREATE POLICY "Anyone can view drivers" ON drivers
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'drivers' AND policyname = 'Admin can manage drivers'
  ) THEN
    CREATE POLICY "Admin can manage drivers" ON drivers
      USING (auth.jwt() ->> 'role' = 'ADMIN');
  END IF;

  -- Orders policies
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Anyone can view orders'
  ) THEN
    CREATE POLICY "Anyone can view orders" ON orders
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can create orders'
  ) THEN
    CREATE POLICY "Users can create orders" ON orders
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admin can manage orders'
  ) THEN
    CREATE POLICY "Admin can manage orders" ON orders
      USING (auth.jwt() ->> 'role' = 'ADMIN');
  END IF;

  -- Routes policies
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Anyone can view routes'
  ) THEN
    CREATE POLICY "Anyone can view routes" ON routes
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Admin can manage routes'
  ) THEN
    CREATE POLICY "Admin can manage routes" ON routes
      USING (auth.jwt() ->> 'role' = 'ADMIN');
  END IF;
END $$;
`;

setupSupabase();