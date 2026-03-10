'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dashboard, Report } from '@/lib/types';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LogoImage } from '@/components/layout/LogoImage';
import { CopyUrlButton } from './CopyUrlButton';
import Link from 'next/link';
import { Calendar, FileText, LayoutDashboard, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function DashboardIcon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any;
  const Icon = icons[name];
  if (!Icon) return <LayoutDashboard className="w-8 h-8 text-blue-600" />;
  return <Icon className="w-8 h-8 text-blue-600" />;
}

export default function DashboardsOverviewPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [reportsByDashboard, setReportsByDashboard] = useState<Map<string, Report[]>>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [{ data: dashData }, { data: repData }] = await Promise.all([
        supabase.from('dashboards').select('*').order('created_at', { ascending: false }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
      ]);

      setDashboards((dashData ?? []) as Dashboard[]);

      const map = new Map<string, Report[]>();
      for (const report of (repData ?? []) as Report[]) {
        if (!report.dashboard_key) continue;
        const list = map.get(report.dashboard_key) ?? [];
        list.push(report);
        map.set(report.dashboard_key, list);
      }
      setReportsByDashboard(map);
      setLoading(false);
    }
    fetchData();
  }, []);

  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/communi-logo.webp" alt="COMMUNi" className="w-6 h-6 object-cover rounded-md border border-gray-200 dark:border-gray-800" />
            COMMUNi Dashboard
          </Link>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <div className="flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">סקירת דשבורדים</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
            סקירת דשבורדים
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            כל הדשבורדים והדוחות במערכת — עם קישורים מלאים להעתקה.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : dashboards.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <LayoutDashboard className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              אין דשבורדים במערכת.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboards.map((dashboard) => {
              const dashReports = reportsByDashboard.get(dashboard.key) ?? [];
              const dashPath = `/dashboard/${dashboard.key}`;
              const isExpanded = expanded.has(dashboard.key);

              return (
                <div
                  key={dashboard.key}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  {/* Dashboard header */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      {dashboard.logo_url ? (
                        <LogoImage
                          src={dashboard.logo_url}
                          className="w-10 h-10 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-800 shrink-0"
                        />
                      ) : (
                        <DashboardIcon name={dashboard.icon} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Link
                            href={dashPath}
                            className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors truncate"
                          >
                            {dashboard.title}
                          </Link>
                          <CopyUrlButton path={dashPath} />
                        </div>
                        {dashboard.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {dashboard.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(dashboard.created_at).toLocaleDateString('he-IL')}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {dashReports.length} דוחות
                          </span>
                          <code className="text-[11px] text-gray-400 dark:text-gray-600 font-mono" dir="ltr">
                            {dashPath}
                          </code>
                        </div>
                      </div>
                      {dashReports.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(dashboard.key)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 mt-1"
                          title={isExpanded ? 'סגור' : 'פתח'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reports list (collapsible) */}
                  {isExpanded && dashReports.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      {dashReports.map((report, i) => {
                        const reportPath = `/dashboard/${dashboard.key}/${report.report_key}`;
                        return (
                          <div
                            key={report.id}
                            className={`px-4 sm:px-5 py-3 flex items-center gap-3 ${
                              i < dashReports.length - 1
                                ? 'border-b border-gray-50 dark:border-gray-800/50'
                                : ''
                            }`}
                          >
                            <div className="w-10 shrink-0 flex justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <Link
                                  href={reportPath}
                                  className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors truncate"
                                >
                                  {report.title}
                                </Link>
                                <CopyUrlButton path={reportPath} />
                                {report.type && (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium shrink-0">
                                    {report.type}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {report.description && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                    {report.description}
                                  </p>
                                )}
                                <code className="text-[10px] text-gray-400 dark:text-gray-600 font-mono shrink-0 hidden sm:block" dir="ltr">
                                  {reportPath}
                                </code>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(report.created_at).toLocaleDateString('he-IL')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
