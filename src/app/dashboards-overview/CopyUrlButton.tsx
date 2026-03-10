'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export function CopyUrlButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
      title="העתק קישור"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Link2 className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
      )}
    </button>
  );
}
