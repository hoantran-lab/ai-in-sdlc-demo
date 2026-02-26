// ============================================================
// Component: SubmitButton - Nút lưu chi tiêu (CMP-015)
// ============================================================

'use client';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  onCancel?: () => void;
}

/**
 * Nút Lưu + Hủy cho form chi tiêu
 */
export default function SubmitButton({
  isSubmitting,
  isValid,
  onCancel,
}: SubmitButtonProps) {
  return (
    <div className="flex gap-3">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-600 transition-colors
            hover:bg-zinc-50 active:bg-zinc-100
            dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-colors
          hover:bg-emerald-600 active:bg-emerald-700
          disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:dark:bg-emerald-800
          dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Đang lưu...
          </span>
        ) : (
          'Lưu'
        )}
      </button>
    </div>
  );
}
