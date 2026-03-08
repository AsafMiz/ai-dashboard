import { ThemeToggle } from './ThemeToggle';

export function Header({ title, subtitle }: { title?: string; subtitle?: string | null }) {
  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
          {title ?? 'לוח מחוונים'}
        </h2>
        {subtitle && (
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate hidden sm:inline">
            {subtitle}
          </span>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
