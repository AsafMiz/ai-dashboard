import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 min-h-screen">
      <Header title="דף לא נמצא" />
      <div className="flex flex-col items-center justify-center py-24">
        <FileQuestion className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          הדף לא נמצא
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          הדוח המבוקש אינו קיים או שהוסר
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          חזרה לדף הראשי
        </Link>
      </div>
    </div>
  );
}
