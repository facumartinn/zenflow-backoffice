'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { pickingAdminMenu, routingAdminMenu } from '@/config/menu-items';
import { LogOutIcon } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const userRole = user?.user_metadata?.role;

  const menuItems = userRole === 'PICKING_ADMIN' ? pickingAdminMenu : routingAdminMenu;

  return (
    <aside className="w-64 bg-card border-r">
      <nav className="h-full flex flex-col">
        <div className="p-4 space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                  pathname === item.href && 'text-foreground bg-accent'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto p-4">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </aside>
  );
}