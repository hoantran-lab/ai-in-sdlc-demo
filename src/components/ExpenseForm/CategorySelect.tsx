// ============================================================
// Component: CategorySelect - Chọn danh mục chi tiêu (CMP-012)
// ============================================================

'use client';

import { useCallback } from 'react';
import type { CategoryDefinition } from '@/src/constants/categories';
import { CATEGORY_CODES } from '@/src/constants/categories';

interface CategorySelectProps {
  value: string;
  onChange: (code: string) => void;
  options: readonly CategoryDefinition[];
  error?: string;
}

/**
 * Grid 2x2 để chọn danh mục chi tiêu (LGC-011)
 */
export default function CategorySelect({
  value,
  onChange,
  options,
  error,
}: CategorySelectProps) {
  const handleSelect = useCallback(
    (categoryCode: string) => {
      // Kiểm tra danh mục hợp lệ
      if (!CATEGORY_CODES.includes(categoryCode)) {
        console.warn('Mã danh mục không hợp lệ:', categoryCode);
        return;
      }
      onChange(categoryCode);
    },
    [onChange]
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Chọn danh mục <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((cat) => {
          const isSelected = value === cat.code;
          return (
            <button
              key={cat.code}
              type="button"
              onClick={() => handleSelect(cat.code)}
              className={`flex flex-col items-center justify-center rounded-xl border-2 px-3 py-4 transition-all
                ${isSelected
                  ? 'border-current shadow-md scale-[1.02]'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                }
              `}
              style={
                isSelected
                  ? { borderColor: cat.color, backgroundColor: cat.color + '15' }
                  : undefined
              }
            >
              <span className="text-2xl">{cat.icon}</span>
              <span
                className={`mt-1 text-xs font-medium ${
                  isSelected
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
