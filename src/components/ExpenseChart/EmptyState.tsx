// ============================================================
// Component: EmptyState - Không có dữ liệu (CMP-024, AF-03.1)
// ============================================================

'use client';

interface EmptyStateProps {
  onAddClick?: () => void;
  message?: string;
}

/**
 * Hiển thị khi tháng đó chưa có chi tiêu nào
 */
export default function EmptyState({
  onAddClick,
  message = 'Chưa có dữ liệu chi tiêu',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-5xl">📊</div>
      <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
        {message}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Hãy thêm chi tiêu đầu tiên của tháng này!
      </p>
      {onAddClick && (
        <button
          type="button"
          onClick={onAddClick}
          className="mt-4 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
        >
          + Thêm chi tiêu
        </button>
      )}
    </div>
  );
}
