// ============================================================
// Page: /stats - Màn hình thống kê chi tiêu (SCR-004, CMP-020)
// ============================================================

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { STORAGE_KEY_SESSION } from '@/src/constants/auth';
import { getStorageItem } from '@/src/lib/utils/storage';
import { useMonthNavigation } from '@/src/hooks/useMonthNavigation';
import { useMonthlyStats } from '@/src/hooks/useMonthlyStats';
import { transformToChartData } from '@/src/lib/utils/chart';
import { MonthPicker } from '@/src/components/MonthPicker';
import { ExpenseBarChart, ChartSkeleton, EmptyState } from '@/src/components/ExpenseChart';
import { TotalCard, CategoryList } from '@/src/components/StatsCard';

export default function StatsPage() {
  const router = useRouter();

  // Kiểm tra session
  const sessionId = getStorageItem(STORAGE_KEY_SESSION);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
    }
  }, [sessionId, router]);

  // Hook điều hướng tháng
  const {
    monthString,
    displayMonth,
    goToPrevious,
    goToNext,
    canGoNext,
  } = useMonthNavigation();

  // Hook fetch dữ liệu thống kê
  const { data, isLoading, error, refetch } = useMonthlyStats(monthString);

  // Transform dữ liệu cho biểu đồ
  const chartData = data ? transformToChartData(data.categories) : [];
  const hasData = data !== null && data.total > 0;

  if (!sessionId) return null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <button
          onClick={() => router.push('/home')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Quay lại"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Thống kê chi tiêu
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Month Picker */}
          <MonthPicker
            displayMonth={displayMonth}
            onPrevious={goToPrevious}
            onNext={goToNext}
            canGoNext={canGoNext}
          />

          {/* Loading state */}
          {isLoading && <ChartSkeleton />}

          {/* Error state */}
          {!isLoading && error && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-3 text-4xl">⚠️</div>
              <p className="text-sm text-red-500">{error.message}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && !hasData && (
            <EmptyState
              onAddClick={() => router.push('/expenses/new')}
            />
          )}

          {/* Có dữ liệu */}
          {!isLoading && !error && hasData && data && (
            <>
              {/* Biểu đồ cột */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <ExpenseBarChart data={chartData} height={250} />
              </div>

              {/* Card tổng chi tiêu */}
              <TotalCard
                total={data.total}
                totalFormatted={data.totalFormatted}
              />

              {/* Chi tiết theo danh mục */}
              <CategoryList categories={data.categories} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
