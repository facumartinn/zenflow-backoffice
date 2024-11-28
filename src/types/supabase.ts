import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  user_metadata: {
    role: 'PICKING_ADMIN' | 'ROUTING_ADMIN';
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      drivers: {
        Row: {
          id: string
          created_at: string
          full_name: string
          license_number: string
          phone: string
          email: string
          status: 'AVAILABLE' | 'BUSY'
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          license_number: string
          phone: string
          email: string
          status?: 'AVAILABLE' | 'BUSY'
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          license_number?: string
          phone?: string
          email?: string
          status?: 'AVAILABLE' | 'BUSY'
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          products: Json
          status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
          latitude: number
          longitude: number
          route_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          products: Json
          status?: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
          latitude: number
          longitude: number
          route_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          products?: Json
          status?: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
          latitude?: number
          longitude?: number
          route_id?: string | null
        }
      }
      routes: {
        Row: {
          id: string
          created_at: string
          driver_id: string
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        }
        Insert: {
          id?: string
          created_at?: string
          driver_id: string
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        }
        Update: {
          id?: string
          created_at?: string
          driver_id?: string
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          password: string
          role: 'ADMIN' | 'USER'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          password: string
          role?: 'ADMIN' | 'USER'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          password?: string
          role?: 'ADMIN' | 'USER'
        }
      }
    }
  }
}