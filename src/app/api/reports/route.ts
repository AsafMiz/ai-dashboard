import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dashboard_key, report_key, title, description, type, logo_url, widgets } = body;

    if (!dashboard_key || typeof dashboard_key !== 'string') {
      return NextResponse.json({ error: 'Missing required field: dashboard_key (string)' }, { status: 400 });
    }
    if (!report_key || typeof report_key !== 'string') {
      return NextResponse.json({ error: 'Missing required field: report_key (string)' }, { status: 400 });
    }
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Missing required field: title (string)' }, { status: 400 });
    }

    // Check dashboard exists
    const { data: dashboard } = await supabaseAdmin
      .from('dashboards')
      .select('key')
      .eq('key', dashboard_key)
      .single();

    if (!dashboard) {
      return NextResponse.json({ error: `Dashboard '${dashboard_key}' not found` }, { status: 404 });
    }

    // Check report doesn't already exist
    const { data: existingReport } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('dashboard_key', dashboard_key)
      .eq('report_key', report_key)
      .single();

    if (existingReport) {
      return NextResponse.json(
        { error: `Report '${report_key}' already exists in dashboard '${dashboard_key}'` },
        { status: 409 }
      );
    }

    // Create the report
    const { data: insertedReport, error: reportError } = await supabaseAdmin
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
      return NextResponse.json({ error: reportError?.message ?? 'Failed to create report' }, { status: 500 });
    }

    // Process widgets with inline data
    if (Array.isArray(widgets) && widgets.length > 0) {
      const datasetRows: { key: string; label: string; columns: { key: string; label: string; type: string }[]; rows: Record<string, unknown>[]; dashboard_key: string }[] = [];
      const widgetRows: { report_id: string; type: string; title: string; order: number; config: Record<string, unknown> }[] = [];

      for (let i = 0; i < widgets.length; i++) {
        const w = widgets[i];
        const config = { ...(w.config ?? {}) };

        // If widget has inline data, create a dataset
        if (Array.isArray(w.data) && w.data.length > 0) {
          const datasetKey = `${dashboard_key}__${report_key}__w${i}`;

          // Infer columns from first row
          const firstRow = w.data[0];
          const columns = Object.keys(firstRow).map((k) => ({
            key: k,
            label: k,
            type: typeof firstRow[k] === 'number' ? 'number' : 'string',
          }));

          datasetRows.push({
            key: datasetKey,
            label: w.title ?? `Widget ${i}`,
            columns,
            rows: w.data,
            dashboard_key,
          });

          config.datasetKey = datasetKey;
        }

        widgetRows.push({
          report_id: insertedReport.id,
          type: w.type,
          title: w.title,
          order: i,
          config,
        });
      }

      // Batch insert datasets
      if (datasetRows.length > 0) {
        const { error: dsError } = await supabaseAdmin
          .from('datasets')
          .upsert(datasetRows, { onConflict: 'key' });

        if (dsError) {
          return NextResponse.json({ error: dsError.message }, { status: 500 });
        }
      }

      // Batch insert widgets
      const { error: widgetError } = await supabaseAdmin.from('widgets').insert(widgetRows);
      if (widgetError) {
        return NextResponse.json({ error: widgetError.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      {
        message: 'Report created successfully',
        dashboard_key,
        report_key,
        url: `/dashboard/${dashboard_key}/${report_key}`,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
