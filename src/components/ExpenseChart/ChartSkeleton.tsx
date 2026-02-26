// ============================================================
// Component: ChartSkeleton - Loading state (CMP-023)
// ============================================================

/**
 * Skeleton loading cho biểu đồ khi đang fetch dữ liệu
 */
export default function ChartSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      {/* Skeleton cho MonthPicker */}
      <div className="mx-auto h-6 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-700" />

      {/* Skeleton cho biểu đồ */}
      <div className="flex items-end justify-center gap-6 px-6 py-4" style={{ height: 250 }}>
        <div className="h-[60%] w-14 rounded-t-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-[35%] w-14 rounded-t-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-[50%] w-14 rounded-t-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-[80%] w-14 rounded-t-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Skeleton cho TotalCard */}
      <div className="mx-4 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-700" />

      {/* Skeleton cho CategoryList */}
      <div className="mx-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    </div>
  );
}
