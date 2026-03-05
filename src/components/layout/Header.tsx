import { ThemeToggle } from './ThemeToggle';

export function Header({ title }: { title?: string }) {
  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
        {title ?? 'לוח מחוונים'}
      </h2>
      <ThemeToggle />
    </header>
  );
}
