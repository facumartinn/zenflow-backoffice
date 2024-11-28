import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { User } from '../types';
import { loginUser, logoutUser, registerUser } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; role?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN'
        });
      }
      setIsLoading(false);
    });

    // Listen for changes on auth state (login, logout, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) throw error;
      if (!session?.user) throw new Error('No user returned from login');

      console.log(session.user, 'session.user');
      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN'
      });
      console.log('daksdlaksdlkasd')
      navigate('/dashboard');
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to logout');
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; role?: string }) => {
    try {
      await registerUser(userData);
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register');
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
        register,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}