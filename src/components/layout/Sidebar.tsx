'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Database,
  Settings,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'ראשי', icon: LayoutDashboard },
  { href: '/report/00000000-0000-0000-0000-000000000001', label: 'סקירת שוק', icon: TrendingUp },
  { href: '#', label: 'נתונים', icon: Database },
  { href: '#', label: 'גרפים', icon: BarChart3 },
  { href: '#', label: 'הגדרות', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            פיננסי<span className="text-blue-600">דש</span>
          </h1>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-600">גרסה 1.0.0</p>
      </div>
    </aside>
  );
}
