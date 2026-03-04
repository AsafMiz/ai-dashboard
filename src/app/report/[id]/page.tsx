import { supabase } from '@/lib/supabase';
import { Report, Widget } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { DashboardGrid } from '@/components/DashboardGrid';
import { notFound } from 'next/navigation';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0; // Always fetch fresh data

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !report) {
    notFound();
  }

  const { data: widgets } = await supabase
    .from('widgets')
    .select('*')
    .eq('report_id', id)
    .order('order', { ascending: true });

  const typedReport = report as Report;
  const typedWidgets = (widgets ?? []) as Widget[];

  return (
    <div className="flex-1 min-h-screen">
      <Header title={typedReport.title} />
      {typedReport.description && (
        <div className="px-6 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {typedReport.description}
          </p>
        </div>
      )}
      <DashboardGrid widgets={typedWidgets} />
    </div>
  );
}
