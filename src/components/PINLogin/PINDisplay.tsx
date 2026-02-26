'use client';

import { PIN_LENGTH } from '@/src/constants/auth';
import { PINDisplayProps } from '@/src/types/auth';

/**
 * Hiển thị 4 ô PIN dạng ● (đã nhập) hoặc ○ (trống).
 * NFR-SEC-04: Luôn che giá trị PIN.
 */
export function PINDisplay({
  pin,
  maxLength = PIN_LENGTH,
  masked = true,
}: PINDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-4" role="status" aria-label={`Đã nhập ${pin.length} trên ${maxLength} số`}>
      {Array.from({ length: maxLength }, (_, index) => {
        const isFilled = index < pin.length;
        return (
          <div
            key={index}
            className={`
              flex h-14 w-14 items-center justify-center rounded-2xl border-2
              transition-all duration-200
              ${
                isFilled
                  ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950'
                  : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900'
              }
            `}
          >
            {isFilled && (
              <span className="text-2xl text-emerald-600 dark:text-emerald-400">
                {masked ? '●' : pin[index]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
