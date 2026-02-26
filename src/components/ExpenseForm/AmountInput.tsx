// ============================================================
// Component: AmountInput - Nhập số tiền (CMP-011)
// ============================================================

'use client';

import { useCallback, useState } from 'react';
import { MAX_AMOUNT } from '@/src/constants/expense';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Input số tiền VND, chỉ chấp nhận số, tự format theo VND (LGC-010)
 */
export default function AmountInput({
  value,
  onChange,
  error,
  disabled = false,
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value > 0 ? new Intl.NumberFormat('vi-VN').format(value) : ''
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Bước 1: Loại bỏ tất cả ký tự không phải số
      const numericOnly = inputValue.replace(/\D/g, '');

      // Bước 2: Chuyển thành số
      let numericValue = parseInt(numericOnly, 10);

      // Bước 3: Kiểm tra NaN
      if (isNaN(numericValue)) {
        numericValue = 0;
      }

      // Bước 4: Giới hạn giá trị tối đa
      if (numericValue > MAX_AMOUNT) {
        numericValue = MAX_AMOUNT;
      }

      // Bước 5: Cập nhật display
      setDisplayValue(
        numericValue > 0
          ? new Intl.NumberFormat('vi-VN').format(numericValue)
          : ''
      );

      // Bước 6: Gọi callback
      onChange(numericValue);
    },
    [onChange]
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Số tiền <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Nhập số tiền"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full rounded-xl border px-4 py-3 pr-10 text-right text-base outline-none transition-colors
            ${error
              ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-950/20'
              : 'border-zinc-200 bg-white focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-emerald-400'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            text-zinc-900 dark:text-zinc-100`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
          đ
        </span>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
