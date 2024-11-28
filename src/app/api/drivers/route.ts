import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: drivers, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(drivers);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const data = await request.json();

  const driverData = {
    ...data,
    status: 'AVAILABLE'
  };

  const { data: driver, error } = await supabase
    .from('drivers')
    .insert([driverData])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      if (error.message.includes('license_number')) {
        return NextResponse.json(
          { error: 'A driver with this license number already exists' },
          { status: 400 }
        );
      }
      if (error.message.includes('email')) {
        return NextResponse.json(
          { error: 'A driver with this email already exists' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(driver);
}