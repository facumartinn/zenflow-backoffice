import { supabaseAdmin } from '../lib/supabase-admin';

export async function setupDatabase() {
  try {
    // Create tables using raw SQL
    const { error: createTablesError } = await supabaseAdmin.rpc('exec', {
      sql: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create tables
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
        );

        CREATE TABLE IF NOT EXISTS drivers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          full_name TEXT NOT NULL,
          license_number TEXT UNIQUE NOT NULL,
          phone TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY'))
        );

        CREATE TABLE IF NOT EXISTS routes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          driver_id UUID NOT NULL REFERENCES drivers(id),
          status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
        );

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
      `
    });

    if (createTablesError) {
      throw new Error(`Error creating tables: ${createTablesError.message}`);
    }

    // Insert test data
    const { data: driver, error: driverError } = await supabaseAdmin
      .from('drivers')
      .upsert([
        {
          full_name: 'John Doe',
          license_number: 'DL123456',
          phone: '+1234567890',
          email: 'john@example.com',
          status: 'AVAILABLE'
        }
      ], { onConflict: 'email' })
      .select()
      .single();

    if (driverError) {
      throw new Error(`Error creating test driver: ${driverError.message}`);
    }

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .upsert([
        {
          customer_name: 'Test Customer',
          customer_phone: '+1987654321',
          delivery_address: '123 Test St, Test City',
          products: { items: [{ name: 'Test Product', quantity: 1 }] },
          latitude: 40.7128,
          longitude: -74.0060,
          status: 'PENDING'
        }
      ], { onConflict: 'customer_phone' });

    if (orderError) {
      throw new Error(`Error creating test order: ${orderError.message}`);
    }

    if (driver) {
      const { error: routeError } = await supabaseAdmin
        .from('routes')
        .upsert([
          {
            driver_id: driver.id,
            status: 'NOT_STARTED'
          }
        ], { onConflict: 'driver_id' });

      if (routeError) {
        throw new Error(`Error creating test route: ${routeError.message}`);
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}