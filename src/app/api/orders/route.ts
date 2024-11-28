import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      route:routes (
        *,
        driver:drivers (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const data = await request.json();

  // Add default coordinates for New York City if not provided
  const orderData = {
    ...data,
    latitude: data.latitude || 40.7128,
    longitude: data.longitude || -74.0060,
    products: data.products || { items: [] }
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(order);
}