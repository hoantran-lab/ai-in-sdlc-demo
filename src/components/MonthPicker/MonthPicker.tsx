// ============================================================
// Component: MonthPicker - Chọn tháng (CMP-021)
// ============================================================

'use client';

interface MonthPickerProps {
  displayMonth: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

/**
 * Bộ chọn tháng: ◀ Tháng MM/YYYY ▶
 */
export default function MonthPicker({
  displayMonth,
  onPrevious,
  onNext,
  canGoNext,
}: MonthPickerProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Nút lùi tháng */}
      <button
        type="button"
        onClick={onPrevious}
        className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
        aria-label="Tháng trước"
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

      {/* Hiển thị tháng */}
      <span className="min-w-[160px] text-center text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {displayMonth}
      </span>

      {/* Nút tiến tháng */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors
          ${canGoNext
            ? 'text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700'
            : 'cursor-not-allowed text-zinc-300 dark:text-zinc-700'
          }`}
        aria-label="Tháng sau"
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
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
