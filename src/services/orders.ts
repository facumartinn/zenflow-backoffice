import axios from '@/lib/axios';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export const getOrders = async () => {
  const { data } = await axios.get<Order[]>('/api/orders');
  return data;
};

export const getOrder = async (id: string) => {
  const { data } = await axios.get<Order>(`/api/orders/${id}`);
  return data;
};

export const createOrder = async (orderData: Omit<OrderInsert, 'id' | 'created_at' | 'route_id'>) => {
  const { data } = await axios.post<Order>('/api/orders', orderData);
  return data;
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const { data } = await axios.patch<Order>(`/api/orders/${id}`, { status });
  return data;
};

export const deleteOrder = async (id: string) => {
  await axios.delete(`/api/orders/${id}`);
};

export const getPendingOrders = async () => {
  const { data } = await axios.get<Order[]>('/api/orders');
  return data.filter(order => order.status === 'PENDING' && !order.route_id);
};