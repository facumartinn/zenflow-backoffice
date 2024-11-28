-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  full_name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY'))
);

CREATE TABLE IF NOT EXISTS public.routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  driver_id UUID NOT NULL REFERENCES public.drivers(id),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  products JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  route_id UUID REFERENCES public.routes(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_routes_status ON public.routes(status);
CREATE INDEX IF NOT EXISTS idx_orders_route_id ON public.orders(route_id);

-- Enable Row Level Security
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view drivers" ON public.drivers
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage drivers" ON public.drivers
  FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Anyone can view orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage orders" ON public.orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Anyone can view routes" ON public.routes
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage routes" ON public.routes
  FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Insert test data
INSERT INTO public.drivers (full_name, license_number, phone, email, status)
VALUES ('John Doe', 'DL123456', '+1234567890', 'john@example.com', 'AVAILABLE')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.orders (
  customer_name, 
  customer_phone, 
  delivery_address, 
  products, 
  latitude, 
  longitude, 
  status
)
VALUES (
  'Test Customer',
  '+1987654321',
  '123 Test St, Test City',
  '{"items": [{"name": "Test Product", "quantity": 1}]}'::jsonb,
  40.7128,
  -74.0060,
  'PENDING'
)
ON CONFLICT (customer_phone) DO NOTHING;

-- Create a test route if the driver exists
WITH driver AS (
  SELECT id FROM public.drivers WHERE email = 'john@example.com' LIMIT 1
)
INSERT INTO public.routes (driver_id, status)
SELECT id, 'NOT_STARTED'
FROM driver
ON CONFLICT DO NOTHING;