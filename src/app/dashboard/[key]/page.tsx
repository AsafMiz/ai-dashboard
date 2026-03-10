import { supabase } from '@/lib/supabase';
import { Dashboard, Report } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { LogoImage } from '@/components/layout/LogoImage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ key: string }>;
}

export const revalidate = 0;

function DashboardIcon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon className="w-8 h-8 text-blue-600" />;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { key } = await params;

  const { data: dashboard, error: dashError } = await supabase
    .from('dashboards')
    .select('*')
    .eq('key', key)
    .single();

  if (dashError || !dashboard) {
    notFound();
  }

  const typedDashboard = dashboard as Dashboard;

  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('dashboard_key', key)
    .order('created_at', { ascending: false });

  const typedReports = (reports ?? []) as Report[];

  return (
    <div className="min-h-screen">
      <Header title={typedDashboard.title} logoUrl={typedDashboard.logo_url} />

      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8 flex items-start gap-4">
          {typedDashboard.logo_url ? (
            <LogoImage src={typedDashboard.logo_url} className="w-10 h-10 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-800 shrink-0" />
          ) : (
            <DashboardIcon name={typedDashboard.icon} />
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {typedDashboard.title}
            </h2>
            {typedDashboard.subtitle && (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {typedDashboard.subtitle}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
          דוחות
        </h3>
        {typedReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              אין דוחות זמינים בלוח מחוונים זה.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {typedReports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/${key}/${report.report_key}`}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {report.title}
                    </h4>
                    {report.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      {report.type && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium">
                          {report.type}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(report.created_at).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-colors mt-1 mr-2 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
