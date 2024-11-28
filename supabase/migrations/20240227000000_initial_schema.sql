-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
);

-- Create drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  full_name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY'))
);

-- Create routes table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

-- Create orders table
CREATE TABLE orders (
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
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_orders_route_id ON orders(route_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view drivers" ON drivers
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage drivers" ON drivers
  USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage orders" ON orders
  USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Anyone can view routes" ON routes
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage routes" ON routes
  USING (auth.jwt() ->> 'role' = 'ADMIN');