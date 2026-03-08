import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dashboard_key, report_key, title, description, type, logo_url, widgets } = body;

    if (!dashboard_key || typeof dashboard_key !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: dashboard_key (string)' },
        { status: 400 }
      );
    }

    if (!report_key || typeof report_key !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: report_key (string)' },
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

    // 1. Delete old report + widgets if exists
    const { data: existingReport } = await supabase
      .from('reports')
      .select('id')
      .eq('dashboard_key', dashboard_key)
      .eq('report_key', report_key)
      .single();

    if (existingReport) {
      await supabase.from('widgets').delete().eq('report_id', existingReport.id);
      await supabase.from('reports').delete().eq('id', existingReport.id);
    }

    // 2. Create the report
    const { data: insertedReport, error: reportError } = await supabase
      .from('reports')
      .insert({
        dashboard_key,
        report_key,
        title,
        description: description ?? null,
        type: type ?? null,
        logo_url: logo_url ?? null,
      })
      .select('id')
      .single();

    if (reportError || !insertedReport) {
      return NextResponse.json(
        { error: reportError?.message ?? 'Failed to create report' },
        { status: 500 }
      );
    }

    // 3. Create widgets if provided
    if (Array.isArray(widgets) && widgets.length > 0) {
      const widgetRows = widgets.map((w: { type: string; title: string; order: number; config: Record<string, unknown> }) => ({
        report_id: insertedReport.id,
        type: w.type,
        title: w.title,
        order: w.order,
        config: w.config,
      }));

      const { error: widgetError } = await supabase.from('widgets').insert(widgetRows);

      if (widgetError) {
        return NextResponse.json({ error: widgetError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: 'Report created successfully',
      dashboard_key,
      report_key,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
