import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: route, error } = await supabase
    .from('routes')
    .select(`
      *,
      driver:drivers (*),
      orders (*)
    `)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(route);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const data = await request.json();

  const { data: route, error: routeError } = await supabase
    .from('routes')
    .update({ status: data.status })
    .eq('id', params.id)
    .select()
    .single();

  if (routeError) {
    return NextResponse.json({ error: routeError.message }, { status: 500 });
  }

  // If route is completed, update driver status to available
  if (data.status === 'COMPLETED') {
    const { error: driverError } = await supabase
      .from('drivers')
      .update({ status: 'AVAILABLE' })
      .eq('id', route.driver_id);

    if (driverError) {
      return NextResponse.json({ error: driverError.message }, { status: 500 });
    }
  }

  // Fetch updated route with related data
  const { data: updatedRoute, error: fetchError } = await supabase
    .from('routes')
    .select(`
      *,
      driver:drivers (*),
      orders (*)
    `)
    .eq('id', params.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json(updatedRoute);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get the route first to get the driver_id
  const { data: route, error: fetchError } = await supabase
    .from('routes')
    .select('driver_id')
    .eq('id', params.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Update associated orders to remove route_id
  const { error: ordersError } = await supabase
    .from('orders')
    .update({ route_id: null })
    .eq('route_id', params.id);

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  // Delete the route
  const { error: deleteError } = await supabase
    .from('routes')
    .delete()
    .eq('id', params.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Update driver status to available
  const { error: driverError } = await supabase
    .from('drivers')
    .update({ status: 'AVAILABLE' })
    .eq('id', route.driver_id);

  if (driverError) {
    return NextResponse.json({ error: driverError.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}