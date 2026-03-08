import { supabase } from '@/lib/supabase';
import { Report, Widget } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { DashboardGrid } from '@/components/DashboardGrid';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  params: Promise<{ key: string; reportKey: string }>;
}

export const revalidate = 0;

export default async function ReportPage({ params }: ReportPageProps) {
  const { key, reportKey } = await params;

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('dashboard_key', key)
    .eq('report_key', reportKey)
    .single();

  if (reportError || !report) {
    notFound();
  }

  const typedReport = report as Report;

  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('report_id', typedReport.id)
    .order('order', { ascending: true });

  const typedWidgets = (widgets ?? []) as Widget[];

  return (
    <div className="min-h-screen">
      <Header title={typedReport.title} subtitle={typedReport.description} logoUrl={typedReport.logo_url} />
      <DashboardGrid widgets={typedWidgets} />
    </div>
  );
}
