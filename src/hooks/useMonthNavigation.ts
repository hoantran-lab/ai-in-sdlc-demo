// ============================================================
// Hook: useMonthNavigation - Điều hướng tháng (HK-021)
// [BẮT BUỘC] Sử dụng date-fns, KHÔNG dùng moment.js
// ============================================================

'use client';

import { useState, useCallback, useMemo } from 'react';
import { format, addMonths, subMonths, isSameMonth, startOfMonth } from 'date-fns';

interface UseMonthNavigationOptions {
  initialMonth?: Date;
}

interface UseMonthNavigationReturn {
  currentMonth: Date;
  monthString: string;
  displayMonth: string;
  goToPrevious: () => void;
  goToNext: () => void;
  canGoNext: boolean;
}

export function useMonthNavigation(
  options?: UseMonthNavigationOptions
): UseMonthNavigationReturn {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(options?.initialMonth ?? new Date())
  );

  // Format "YYYY-MM" cho API query
  const monthString = useMemo(
    () => format(currentMonth, 'yyyy-MM'),
    [currentMonth]
  );

  // Format "Tháng MM/YYYY" cho hiển thị (LGC-022)
  const displayMonth = useMemo(
    () => format(currentMonth, "'Tháng' MM/yyyy"),
    [currentMonth]
  );

  // Không cho chọn tháng tương lai (BR-03.1)
  const canGoNext = useMemo(() => {
    const today = new Date();
    return !isSameMonth(currentMonth, today);
  }, [currentMonth]);

  // Lùi 1 tháng (LGC-020)
  const goToPrevious = useCallback(() => {
    setCurrentMonth((prev) => startOfMonth(subMonths(prev, 1)));
  }, []);

  // Tiến 1 tháng (LGC-021)
  const goToNext = useCallback(() => {
    setCurrentMonth((prev) => {
      const next = addMonths(prev, 1);
      const today = new Date();
      // Không cho vượt tháng hiện tại
      if (isSameMonth(next, today) || next < today) {
        return startOfMonth(next);
      }
      return prev;
    });
  }, []);

  return {
    currentMonth,
    monthString,
    displayMonth,
    goToPrevious,
    goToNext,
    canGoNext,
  };
}
