import { createClient } from '@supabase/supabase-js';
import { LoginCredentials, AuthResponse } from '../types';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Function to create admin users
export const createAdminUsers = async () => {
  try {
    // Create routing admin
    const { data: routingAdmin, error: routingError } = await supabaseAdmin.auth.admin.createUser({
      email: 'routing@zenflow.com',
      password: 'routing123',
      email_confirm: true,
      user_metadata: {
        role: 'ROUTING_ADMIN'
      }
    });

    if (routingError) {
      console.error('Error creating routing admin:', routingError);
    }

    // Create picking admin
    const { data: pickingAdmin, error: pickingError } = await supabaseAdmin.auth.admin.createUser({
      email: 'picking@zenflow.com',
      password: 'picking123',
      email_confirm: true,
      user_metadata: {
        role: 'PICKING_ADMIN'
      }
    });

    if (pickingError) {
      console.error('Error creating picking admin:', pickingError);
    }

    return { routingAdmin, pickingAdmin };
  } catch (error) {
    console.error('Error creating admin users:', error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data: { user, session }, error } = await supabaseAdmin.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    console.error('Auth error:', error);
    throw error;
  }

  if (!user || !session) {
    throw new Error('Authentication failed');
  }

  return {
    access_token: session.access_token,
    user: {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'ROUTING_ADMIN'
    }
  };
};

export const registerUser = async (userData: { email: string; password: string; role?: string }) => {
  const { data: { user }, error } = await supabaseAdmin.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        role: userData.role || 'ROUTING_ADMIN'
      }
    }
  });

  if (error) throw error;
  return user;
};

export const logoutUser = async () => {
  const { error } = await supabaseAdmin.auth.signOut();
  if (error) throw error;
};