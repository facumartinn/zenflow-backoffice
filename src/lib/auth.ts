import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@/types';

const supabase = createClientComponentClient();

export async function signIn(credentials: { email: string; password: string }) {
  const { data: { session }, error } = await supabase.auth.signInWithPassword(credentials);
  
  if (error) throw error;
  if (!session?.user) throw new Error('No user returned from login');

  const user: User = {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN'
  };

  return { user, session };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role as 'ROUTING_ADMIN' | 'PICKING_ADMIN'
  };
}

export function getDefaultRoute(role: string): string {
  switch (role) {
    case 'ROUTING_ADMIN':
      return '/dashboard';
    case 'PICKING_ADMIN':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}