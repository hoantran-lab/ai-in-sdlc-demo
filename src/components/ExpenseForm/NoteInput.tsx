// ============================================================
// Component: NoteInput - Ghi chú (CMP-014)
// ============================================================

'use client';

import { useCallback } from 'react';
import { MAX_NOTE_LENGTH } from '@/src/constants/expense';

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Textarea ghi chú tùy chọn, max 200 ký tự
 */
export default function NoteInput({
  value,
  onChange,
  error,
  disabled = false,
}: NoteInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const charCount = value.length;
  const isNearLimit = charCount > MAX_NOTE_LENGTH * 0.8;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Ghi chú{' '}
        <span className="text-zinc-400 dark:text-zinc-500">(tùy chọn)</span>
      </label>
      <textarea
        rows={3}
        placeholder="VD: Mua rau củ quả ở chợ..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={MAX_NOTE_LENGTH}
        className={`w-full resize-none rounded-xl border px-4 py-3 text-base outline-none transition-colors
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-950/20'
            : 'border-zinc-200 bg-white focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-emerald-400'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          text-zinc-900 dark:text-zinc-100`}
      />
      <div className="mt-1 flex items-center justify-between">
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          <span />
        )}
        <span
          className={`text-xs ${
            isNearLimit
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {charCount}/{MAX_NOTE_LENGTH}
        </span>
      </div>
    </div>
  );
}
