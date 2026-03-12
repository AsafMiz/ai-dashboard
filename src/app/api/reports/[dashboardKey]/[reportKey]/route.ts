import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface RouteParams {
  params: Promise<{ dashboardKey: string; reportKey: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { dashboardKey, reportKey } = await params;

    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('source_json')
      .eq('dashboard_key', dashboardKey)
      .eq('report_key', reportKey)
      .single();

    if (!report) {
      return NextResponse.json(
        { error: `Report '${reportKey}' not found in dashboard '${dashboardKey}'` },
        { status: 404 }
      );
    }

    if (!report.source_json) {
      return NextResponse.json(
        { error: `No source JSON available for report '${reportKey}'` },
        { status: 404 }
      );
    }

    return NextResponse.json(report.source_json);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { dashboardKey, reportKey } = await params;

    // Find the report
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('dashboard_key', dashboardKey)
      .eq('report_key', reportKey)
      .single();

    if (!report) {
      return NextResponse.json(
        { error: `Report '${reportKey}' not found in dashboard '${dashboardKey}'` },
        { status: 404 }
      );
    }

    // Read widget configs to find dataset keys
    const { data: widgets } = await supabaseAdmin
      .from('widgets')
      .select('config')
      .eq('report_id', report.id);

    const datasetKeys = (widgets ?? [])
      .map((w) => (w.config as Record<string, unknown>)?.datasetKey)
      .filter((k): k is string => typeof k === 'string');

    // Delete associated datasets
    if (datasetKeys.length > 0) {
      await supabaseAdmin
        .from('datasets')
        .delete()
        .in('key', datasetKeys);
    }

    // Delete the report (widgets cascade via FK)
    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', report.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Report '${reportKey}' deleted successfully`,
      dashboard_key: dashboardKey,
      report_key: reportKey,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
