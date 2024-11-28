import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: routes, error } = await supabase
      .from('routes')
      .select(`
        *,
        driver:drivers (*),
        orders (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching routes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error in routes API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const data = await request.json();

    // Start a transaction by creating the route first
    const { data: route, error: routeError } = await supabase
      .from('routes')
      .insert([{
        driver_id: data.driver_id,
        status: data.status || 'NOT_STARTED'
      }])
      .select()
      .single();

    if (routeError) {
      return NextResponse.json({ error: routeError.message }, { status: 500 });
    }

    // Update the orders with the new route_id
    const { error: ordersError } = await supabase
      .from('orders')
      .update({ route_id: route.id })
      .in('id', data.order_ids);

    if (ordersError) {
      // If there's an error, try to rollback by deleting the route
      await supabase.from('routes').delete().eq('id', route.id);
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    // Update driver status to BUSY
    const { error: driverError } = await supabase
      .from('drivers')
      .update({ status: 'BUSY' })
      .eq('id', data.driver_id);

    if (driverError) {
      return NextResponse.json({ error: driverError.message }, { status: 500 });
    }

    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}