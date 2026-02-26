'use client';

import { PINKeypadButtonProps } from '@/src/types/auth';

/**
 * Nút số đơn lẻ trên bàn phím PIN.
 * Variant: 'number' | 'delete' | 'empty'
 */
export function PINKeypadButton({
  value,
  onClick,
  disabled = false,
  variant = 'number',
}: PINKeypadButtonProps) {
  if (variant === 'empty') {
    return <div className="h-16 w-16" />;
  }

  const isDelete = variant === 'delete';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex h-16 w-16 items-center justify-center rounded-full
        text-2xl font-medium transition-all duration-150
        ${
          isDelete
            ? 'bg-transparent text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800'
            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
        }
        disabled:cursor-not-allowed disabled:opacity-40
      `}
      aria-label={isDelete ? 'Xóa số cuối' : `Số ${value}`}
    >
      {isDelete ? (
        // Icon xóa (backspace)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z"
          />
        </svg>
      ) : (
        value
      )}
    </button>
  );
}
