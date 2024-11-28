import { 
  HomeIcon, 
  PackageIcon, 
  UsersIcon, 
  UserIcon, 
  CogIcon, 
  MapIcon 
} from 'lucide-react';

export const pickingAdminMenu = [
  {
    href: '/dashboard',
    label: 'Inicio',
    icon: HomeIcon,
  },
  {
    href: '/pedidos',
    label: 'Pedidos',
    icon: PackageIcon,
  },
  {
    href: '/perfil',
    label: 'Perfil',
    icon: UserIcon,
  },
  {
    href: '/configuracion',
    label: 'Configuración',
    icon: CogIcon,
  }
];

export const routingAdminMenu = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: PackageIcon,
  },
  {
    href: '/drivers',
    label: 'Drivers',
    icon: UsersIcon,
  },
  {
    href: '/routes',
    label: 'Routes',
    icon: MapIcon,
  }
]; 