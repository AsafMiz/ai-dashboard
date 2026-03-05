'use client';

import { ThemeToggle } from './ThemeToggle';
import { useSidebar } from './SidebarContext';
import { RefreshCw, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header({ title }: { title?: string }) {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSidebar();

  async function handleCollectData() {
    setLoading(true);
    try {
      const res = await fetch('/api/collect-data', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      console.error('שגיאה באיסוף נתונים:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          aria-label="פתח תפריט"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
          {title ?? 'לוח מחוונים'}
        </h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleCollectData}
          disabled={loading}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">עדכן נתונים</span>
          <span className="sm:hidden">עדכון</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
