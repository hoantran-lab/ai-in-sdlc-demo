// ============================================================
// Component: DatePicker - Chọn ngày chi tiêu (CMP-013)
// [BẮT BUỘC] Sử dụng date-fns, KHÔNG dùng moment.js
// ============================================================

'use client';

import { useCallback } from 'react';
import { format, startOfDay, isAfter, subDays } from 'date-fns';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  maxDate?: Date;
  error?: string;
}

/**
 * DatePicker với quick buttons "Hôm nay" / "Hôm qua" (LGC-012)
 */
export default function DatePicker({
  value,
  onChange,
  maxDate,
  error,
}: DatePickerProps) {
  const today = startOfDay(new Date());
  const max = maxDate ?? today;

  // Format ngày cho input type="date"
  const inputValue = format(value, 'yyyy-MM-dd');
  const maxInputValue = format(max, 'yyyy-MM-dd');

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateStr = e.target.value;
      if (!dateStr) return;

      const selectedDate = new Date(dateStr + 'T00:00:00');

      // Kiểm tra ngày tương lai
      if (isAfter(startOfDay(selectedDate), today)) {
        return;
      }

      onChange(selectedDate);
    },
    [onChange, today]
  );

  const handleTodayClick = useCallback(() => {
    onChange(startOfDay(new Date()));
  }, [onChange]);

  const handleYesterdayClick = useCallback(() => {
    onChange(subDays(startOfDay(new Date()), 1));
  }, [onChange]);

  // Kiểm tra xem value có phải hôm nay hay hôm qua
  const isToday =
    format(value, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isYesterday =
    format(value, 'yyyy-MM-dd') === format(subDays(new Date(), 1), 'yyyy-MM-dd');

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Ngày chi tiêu <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        value={inputValue}
        max={maxInputValue}
        onChange={handleDateChange}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-950/20'
            : 'border-zinc-200 bg-white focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-emerald-400'
          }
          text-zinc-900 dark:text-zinc-100`}
      />

      {/* Quick buttons */}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handleTodayClick}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors
            ${isToday
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
        >
          Hôm nay
        </button>
        <button
          type="button"
          onClick={handleYesterdayClick}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors
            ${isYesterday
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
        >
          Hôm qua
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
