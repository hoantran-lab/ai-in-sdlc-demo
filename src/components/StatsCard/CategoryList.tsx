// ============================================================
// Component: CategoryList - Chi tiết danh mục (CMP-026)
// ============================================================

import type { CategoryStat } from '@/src/types/stats';

interface CategoryListProps {
  categories: CategoryStat[];
}

/**
 * Danh sách chi tiết chi tiêu theo từng danh mục
 */
export default function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Chi tiết theo danh mục
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.code}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {cat.name}
                </p>
                {cat.percentage > 0 && (
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {/* Thanh tiến trình nhỏ */}
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400">
                      {cat.percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {cat.totalFormatted}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
