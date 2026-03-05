import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, subtitle, icon, market_data } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: key (string)' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: title (string)' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Delete old data for this key: widgets → reports → dashboard
    const { data: oldReports } = await supabase
      .from('reports')
      .select('id')
      .eq('dashboard_key', key);

    if (oldReports && oldReports.length > 0) {
      const reportIds = oldReports.map((r) => r.id);
      await supabase.from('widgets').delete().in('report_id', reportIds);
      await supabase.from('reports').delete().eq('dashboard_key', key);
    }

    await supabase.from('dashboards').delete().eq('key', key);

    // 2. Seed market data if provided
    if (Array.isArray(market_data) && market_data.length > 0) {
      const { error: marketError } = await supabase
        .from('market_data')
        .upsert(market_data, { onConflict: 'symbol,date' });

      if (marketError) {
        return NextResponse.json({ error: marketError.message }, { status: 500 });
      }
    }

    // 3. Create the dashboard
    const { error: dashError } = await supabase
      .from('dashboards')
      .insert({ key, title, subtitle: subtitle ?? null, icon: icon ?? 'LayoutDashboard' });

    if (dashError) {
      return NextResponse.json({ error: dashError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Dashboard created successfully', key });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
