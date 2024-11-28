'use client';

import { Menu } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur-sm supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden -ml-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>
          )}

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground/90">{user?.email}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}