'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { User } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN',
            user_metadata: session.user.user_metadata as { role: 'ROUTING_ADMIN' | 'PICKING_ADMIN' },
            app_metadata: session.user.app_metadata,
            aud: session.user.aud,
            created_at: session.user.created_at
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN',
          user_metadata: session.user.user_metadata as { role: 'ROUTING_ADMIN' | 'PICKING_ADMIN' },
          app_metadata: session.user.app_metadata,
          aud: session.user.aud,
          created_at: session.user.created_at
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) throw error;
      if (!session?.user) throw new Error('No user returned from login');

      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN',
        user_metadata: session.user.user_metadata as { role: 'ROUTING_ADMIN' | 'PICKING_ADMIN' },
        app_metadata: session.user.app_metadata,
        aud: session.user.aud,
        created_at: session.user.created_at
      });

      toast.success('Successfully logged in!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = '/login';
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}