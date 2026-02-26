// ============================================================
// Hook: useMonthlyStats - Fetch thống kê tháng (HK-020, LGC-023)
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMonthlyStats } from '@/src/lib/api/stats';
import type { MonthlyStats } from '@/src/types/stats';

interface UseMonthlyStatsReturn {
  data: MonthlyStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMonthlyStats(month: string): UseMonthlyStatsReturn {
  const [data, setData] = useState<MonthlyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => {
    setFetchKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchMonthlyStats(month);

        if (!cancelled) {
          if (response.success) {
            setData(response.data);
          } else {
            throw new Error('Không thể tải dữ liệu');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Đã xảy ra lỗi'));
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [month, fetchKey]);

  return { data, isLoading, error, refetch };
}
