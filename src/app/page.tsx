import { supabase } from '@/lib/supabase';
import { Report } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { BarChart3, Calendar, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  const typedReports = (reports ?? []) as Report[];

  return (
    <div className="flex-1 min-h-screen">
      <Header title="לוח מחוונים ראשי" />
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ברוכים הבאים
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            בחרו דוח לצפייה או לחצו על &quot;עדכן נתונים&quot; לטעינת נתוני דוגמה
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">סה״כ דוחות</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{typedReports.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">נכסים במעקב</p>
            <p className="text-2xl font-bold text-blue-600">1</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">עדכון אחרון</p>
            <p className="text-2xl font-bold text-emerald-600">היום</p>
          </div>
        </div>

        {/* Reports List */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          דוחות זמינים
        </h3>
        {typedReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              אין דוחות זמינים. הגדירו את חיבור Supabase כדי להתחיל.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typedReports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h4>
                    {report.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {report.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(report.created_at).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
