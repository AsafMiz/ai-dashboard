'use client';

import { MessageCircle, Heart, Eye } from 'lucide-react';
import { DataRow, WidgetConfig } from '@/lib/types';

interface FeedWidgetProps {
  data: DataRow[];
  config: WidgetConfig;
}

const metricIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  comments: MessageCircle,
  likes: Heart,
  views: Eye,
};

const badgeColors: Record<string, string> = {
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function getBadgeColor(badge: string, accentColor: string) {
  // Use a subtle tinted style based on the accent color
  void badge;
  return {
    backgroundColor: `${accentColor}15`,
    color: accentColor,
  };
}

export function FeedWidget({ data, config }: FeedWidgetProps) {
  const color = config.color ?? '#10b981';
  const titleKey = config.titleKey ?? 'title';
  const badgeKey = config.badgeKey ?? 'badge';
  const authorKey = config.authorKey ?? 'author';
  const excerptKey = config.excerptKey ?? 'excerpt';
  const metricsKeys = (config.metricsKeys as string[]) ?? ['comments', 'likes', 'views'];

  void badgeColors;

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto">
      {data.map((row, index) => {
        const title = String(row[titleKey] ?? '');
        const badge = String(row[badgeKey] ?? '');
        const author = String(row[authorKey] ?? '');
        const excerpt = String(row[excerptKey] ?? '');

        return (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2.5"
          >
            {/* Badge + Title + Author */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {title}
                  </span>
                  {badge && (
                    <span
                      className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={getBadgeColor(badge, color)}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                {author && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    מאת {author}
                  </p>
                )}
              </div>
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            )}

            {/* Metrics */}
            {metricsKeys.length > 0 && (
              <div className="flex items-center gap-4 pt-1">
                {metricsKeys.map((key) => {
                  const value = Number(row[key] ?? 0);
                  const Icon = metricIcons[key] ?? Eye;
                  return (
                    <div key={key} className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <span className="tabular-nums">{value.toLocaleString()}</span>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
