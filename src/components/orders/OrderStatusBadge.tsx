import { Database } from '../../types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderStatusBadgeProps {
  status: Order['status'];
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    IN_TRANSIT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
      {status.toLowerCase().replace('_', ' ')}
    </span>
  );
}