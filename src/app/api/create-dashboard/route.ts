import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getMockDashboard(key: string) {
  return {
    dashboard: {
      key,
      title: 'סקירת שוק יומית',
      subtitle: 'לוח מחוונים מקיף לניתוח שוק ההון - AAPL, MSFT, GOOGL, TSLA, NVDA',
      icon: 'TrendingUp',
    },
    reports: [
      {
        report_key: 'market-overview',
        title: 'סקירת שוק כללית',
        description: 'תצוגה כללית של מגמות המחירים ונפחי המסחר בחמש המניות המובילות',
        type: 'סקירה',
        widgets: [
          { type: 'area', title: 'מגמת מחיר - AAPL', order: 0, config: { symbol: 'AAPL', color: '#2563eb', dataKey: 'close' } },
          { type: 'area', title: 'מגמת מחיר - MSFT', order: 1, config: { symbol: 'MSFT', color: '#7c3aed', dataKey: 'close' } },
          { type: 'area', title: 'מגמת מחיר - GOOGL', order: 2, config: { symbol: 'GOOGL', color: '#059669', dataKey: 'close' } },
          { type: 'area', title: 'מגמת מחיר - NVDA', order: 3, config: { symbol: 'NVDA', color: '#76b900', dataKey: 'close' } },
          { type: 'bar', title: 'נפח מסחר - AAPL', order: 4, config: { symbol: 'AAPL', color: '#2563eb', dataKey: 'volume' } },
          { type: 'bar', title: 'נפח מסחר - TSLA', order: 5, config: { symbol: 'TSLA', color: '#e11d48', dataKey: 'volume' } },
        ],
      },
      {
        report_key: 'technical-analysis',
        title: 'ניתוח טכני - AAPL & MSFT',
        description: 'גרפי נרות ונתוני מסחר מפורטים עבור אפל ומייקרוסופט',
        type: 'ניתוח',
        widgets: [
          { type: 'candlestick', title: 'גרף נרות - AAPL', order: 0, config: { symbol: 'AAPL' } },
          { type: 'candlestick', title: 'גרף נרות - MSFT', order: 1, config: { symbol: 'MSFT' } },
          { type: 'table', title: 'נתוני מסחר - AAPL', order: 2, config: { symbol: 'AAPL', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] } },
          { type: 'table', title: 'נתוני מסחר - MSFT', order: 3, config: { symbol: 'MSFT', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] } },
        ],
      },
      {
        report_key: 'nvidia-deep-dive',
        title: 'NVDA - ניתוח מעמיק',
        description: 'ניתוח מקיף של מניית אנבידיה - מחיר, נפח מסחר וגרף נרות',
        type: 'מניה',
        widgets: [
          { type: 'candlestick', title: 'גרף נרות - NVDA', order: 0, config: { symbol: 'NVDA' } },
          { type: 'area', title: 'מגמת מחיר סגירה - NVDA', order: 1, config: { symbol: 'NVDA', color: '#76b900', dataKey: 'close' } },
          { type: 'bar', title: 'נפח מסחר יומי - NVDA', order: 2, config: { symbol: 'NVDA', color: '#76b900', dataKey: 'volume' } },
          { type: 'table', title: 'נתוני מסחר - NVDA', order: 3, config: { symbol: 'NVDA', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] } },
        ],
      },
      {
        report_key: 'tesla-analysis',
        title: 'TSLA - ניתוח טסלה',
        description: 'מעקב אחר ביצועי מניית טסלה כולל תנודתיות גבוהה',
        type: 'מניה',
        widgets: [
          { type: 'candlestick', title: 'גרף נרות - TSLA', order: 0, config: { symbol: 'TSLA' } },
          { type: 'area', title: 'מגמת מחיר - TSLA', order: 1, config: { symbol: 'TSLA', color: '#e11d48', dataKey: 'close' } },
          { type: 'bar', title: 'נפח מסחר - TSLA', order: 2, config: { symbol: 'TSLA', color: '#e11d48', dataKey: 'volume' } },
          { type: 'table', title: 'נתוני מסחר - TSLA', order: 3, config: { symbol: 'TSLA', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] } },
        ],
      },
      {
        report_key: 'google-analysis',
        title: 'GOOGL - ניתוח גוגל',
        description: 'ניתוח ביצועי מניית אלפבית (גוגל)',
        type: 'מניה',
        widgets: [
          { type: 'candlestick', title: 'גרף נרות - GOOGL', order: 0, config: { symbol: 'GOOGL' } },
          { type: 'area', title: 'מגמת מחיר - GOOGL', order: 1, config: { symbol: 'GOOGL', color: '#059669', dataKey: 'close' } },
          { type: 'bar', title: 'נפח מסחר - GOOGL', order: 2, config: { symbol: 'GOOGL', color: '#059669', dataKey: 'volume' } },
          { type: 'table', title: 'נתוני מסחר - GOOGL', order: 3, config: { symbol: 'GOOGL', columns: ['date', 'open', 'high', 'low', 'close', 'volume'] } },
        ],
      },
      {
        report_key: 'volume-comparison',
        title: 'השוואת נפחי מסחר',
        description: 'השוואת נפחי מסחר יומיים בין כל חמש המניות',
        type: 'השוואה',
        widgets: [
          { type: 'bar', title: 'נפח מסחר - AAPL', order: 0, config: { symbol: 'AAPL', color: '#2563eb', dataKey: 'volume' } },
          { type: 'bar', title: 'נפח מסחר - MSFT', order: 1, config: { symbol: 'MSFT', color: '#7c3aed', dataKey: 'volume' } },
          { type: 'bar', title: 'נפח מסחר - GOOGL', order: 2, config: { symbol: 'GOOGL', color: '#059669', dataKey: 'volume' } },
          { type: 'bar', title: 'נפח מסחר - TSLA', order: 3, config: { symbol: 'TSLA', color: '#e11d48', dataKey: 'volume' } },
          { type: 'bar', title: 'נפח מסחר - NVDA', order: 4, config: { symbol: 'NVDA', color: '#76b900', dataKey: 'volume' } },
        ],
      },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'שדה "key" נדרש ויחייב להיות מחרוזת' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const mock = getMockDashboard(key);

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

    // 2. Seed market data from data.json
    const filePath = path.join(process.cwd(), 'data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const marketRecords = JSON.parse(fileContent);

    await supabase
      .from('market_data')
      .upsert(marketRecords, { onConflict: 'symbol,date' });

    // 3. Create the dashboard
    const { error: dashError } = await supabase
      .from('dashboards')
      .insert(mock.dashboard);

    if (dashError) {
      return NextResponse.json({ error: dashError.message }, { status: 500 });
    }

    // 4. Create reports and their widgets
    for (const reportDef of mock.reports) {
      const { widgets, ...reportData } = reportDef;

      const { data: insertedReport, error: reportError } = await supabase
        .from('reports')
        .insert({ ...reportData, dashboard_key: key })
        .select('id')
        .single();

      if (reportError || !insertedReport) {
        return NextResponse.json(
          { error: reportError?.message ?? 'שגיאה ביצירת דוח' },
          { status: 500 }
        );
      }

      // Insert widgets
      const widgetRows = widgets.map((w) => ({
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
      message: 'לוח המחוונים נוצר בהצלחה',
      key,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
