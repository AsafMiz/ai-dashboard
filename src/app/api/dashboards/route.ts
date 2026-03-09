import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, subtitle, icon, logo_url } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Missing required field: key (string)' }, { status: 400 });
    }
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Missing required field: title (string)' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('dashboards')
      .select('key')
      .eq('key', key)
      .single();

    if (existing) {
      return NextResponse.json({ error: `Dashboard with key '${key}' already exists` }, { status: 409 });
    }

    const { error } = await supabaseAdmin
      .from('dashboards')
      .insert({ key, title, subtitle: subtitle ?? null, icon: icon ?? 'LayoutDashboard', logo_url: logo_url ?? null });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Dashboard created successfully', key, url: `/dashboard/${key}` },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
