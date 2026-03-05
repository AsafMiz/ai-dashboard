'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function HomePage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (trimmed) {
      router.push(`/dashboard/${encodeURIComponent(trimmed)}`);
    }
  }

  async function handleCreateExample() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'example' }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'שגיאה ביצירת דשבורד לדוגמה');
        return;
      }
      router.push('/dashboard/example');
    } catch {
      alert('שגיאה ביצירת דשבורד לדוגמה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          פיננסי<span className="text-blue-600">דש</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label
            htmlFor="dashboard-key"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            הזינו מפתח דשבורד
          </label>
          <input
            id="dashboard-key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="לדוגמה: example"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            dir="ltr"
          />
        </div>
        <button
          type="submit"
          disabled={!key.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
        >
          <span>כניסה ללוח מחוונים</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </form>

      <div className="w-full max-w-md mt-8">
        <div className="relative flex items-center mb-4">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
          <span className="px-3 text-xs text-gray-400 dark:text-gray-600">או</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
        </div>
        <button
          onClick={handleCreateExample}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-gray-900 rounded-xl text-sm font-medium transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? 'יוצר דשבורד לדוגמה...' : 'צור דשבורד לדוגמה'}</span>
        </button>
      </div>
    </div>
  );
}
