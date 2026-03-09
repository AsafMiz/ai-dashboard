import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface RouteParams {
  params: Promise<{ key: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { key } = await params;

    const { data: dashboard, error } = await supabaseAdmin
      .from('dashboards')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !dashboard) {
      return NextResponse.json({ error: `Dashboard '${key}' not found` }, { status: 404 });
    }

    const { data: reports } = await supabaseAdmin
      .from('reports')
      .select('report_key, title, description, type, logo_url, created_at')
      .eq('dashboard_key', key)
      .order('created_at', { ascending: false });

    const reportsWithUrls = (reports ?? []).map((r) => ({
      ...r,
      url: `/dashboard/${key}/${r.report_key}`,
    }));

    return NextResponse.json({ dashboard, reports: reportsWithUrls });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { key } = await params;

    const { data: existing } = await supabaseAdmin
      .from('dashboards')
      .select('key')
      .eq('key', key)
      .single();

    if (!existing) {
      return NextResponse.json({ error: `Dashboard '${key}' not found` }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('dashboards')
      .delete()
      .eq('key', key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Dashboard '${key}' deleted successfully`, key });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
