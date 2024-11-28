import axios from '@/lib/axios';
import { Database } from '@/types/supabase';

type Driver = Database['public']['Tables']['drivers']['Row'];
type DriverInsert = Database['public']['Tables']['drivers']['Insert'];

export const getDrivers = async () => {
  const { data } = await axios.get<Driver[]>('/api/drivers');
  return data;
};

export const getDriver = async (id: string) => {
  const { data } = await axios.get<Driver>(`/api/drivers/${id}`);
  return data;
};

export const createDriver = async (driverData: Omit<DriverInsert, 'id' | 'created_at'>) => {
  const { data } = await axios.post<Driver>('/api/drivers', driverData);
  return data;
};

export const updateDriverStatus = async (id: string, status: Driver['status']) => {
  const { data } = await axios.patch<Driver>(`/api/drivers/${id}`, { status });
  return data;
};

export const deleteDriver = async (id: string) => {
  await axios.delete(`/api/drivers/${id}`);
};

export const getAvailableDrivers = async () => {
  const { data } = await axios.get<Driver[]>('/api/drivers');
  return data.filter(driver => driver.status === 'AVAILABLE');
};