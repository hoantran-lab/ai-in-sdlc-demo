'use client';

import { LockOverlayProps } from '@/src/types/auth';
import { useCountdown } from '@/src/hooks/useCountdown';

/**
 * Overlay hiển thị khi tài khoản bị khóa tạm thời.
 * Đếm ngược thời gian còn lại (NFR-SEC-03).
 */
export function LockOverlay({ lockUntil, onUnlock }: LockOverlayProps) {
  const { remainingSeconds, isActive } = useCountdown(lockUntil, onUnlock);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95">
      {/* Icon khóa */}
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Thông báo */}
      <p className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">
        Tạm khóa
      </p>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Bạn đã nhập sai quá số lần cho phép
      </p>

      {/* Đếm ngược */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white">
        {remainingSeconds}
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        giây còn lại
      </p>
    </div>
  );
}
