import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Read mock data from local file
    const filePath = path.join(process.cwd(), 'data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const records = JSON.parse(fileContent);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Upsert records into market_data
    const { data, error } = await supabase
      .from('market_data')
      .upsert(records, { onConflict: 'symbol,date' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'הנתונים נטענו בהצלחה',
      count: data?.length ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
