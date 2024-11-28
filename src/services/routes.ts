import axios from '@/lib/axios';
import { Database } from '@/types/supabase';

type Route = Database['public']['Tables']['routes']['Row'];
type RouteInsert = Database['public']['Tables']['routes']['Insert'];

export const getRoutes = async () => {
  const { data } = await axios.get<Route[]>('/api/routes');
  return data;
};

export const getRoute = async (id: string) => {
  const { data } = await axios.get<Route>(`/api/routes/${id}`);
  return data;
};

export const createRoute = async (routeData: {
  driver_id: string;
  order_ids: string[];
  status?: Route['status'];
}) => {
  const { data } = await axios.post<Route>('/api/routes', routeData);
  return data;
};

export const updateRouteStatus = async (id: string, status: Route['status']) => {
  const { data } = await axios.patch<Route>(`/api/routes/${id}`, { status });
  return data;
};

export const deleteRoute = async (id: string) => {
  await axios.delete(`/api/routes/${id}`);
};