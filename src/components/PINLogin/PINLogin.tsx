'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PINLoginProps } from '@/src/types/auth';
import {
  MAX_ATTEMPTS,
  LOCK_DURATION_SECONDS,
  STORAGE_KEY_SESSION,
  PIN_LENGTH,
} from '@/src/constants/auth';
import { verifyPin } from '@/src/lib/api/auth';
import { setStorageItem } from '@/src/lib/utils/storage';
import { usePINInput } from '@/src/hooks/usePINInput';
import { useLockout } from '@/src/hooks/useLockout';
import { PINDisplay } from './PINDisplay';
import { PINKeypad } from './PINKeypad';
import { LockOverlay } from './LockOverlay';

/**
 * Container chính cho màn hình đăng nhập mã PIN (CMP-001).
 * Kết nối tất cả sub-components và hooks.
 */
export function PINLogin({
  onSuccess,
  maxAttempts = MAX_ATTEMPTS,
  lockDurationSeconds = LOCK_DURATION_SECONDS,
}: PINLoginProps) {
  const router = useRouter();

  // State
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { isLocked, lockUntil, activate, deactivate } = useLockout();
  const { pin, addDigit, removeDigit, clearPin, isFull } = usePINInput(PIN_LENGTH);

  // Ref để tránh stale closure trong useEffect
  const attemptsRef = useRef(attempts);
  attemptsRef.current = attempts;

  // LGC-003: handleSubmit - auto-trigger khi nhập đủ 4 số
  useEffect(() => {
    if (!isFull || isLocked || isLoading) return;

    const pinString = pin.join('');

    const doSubmit = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        // Gọi API xác thực PIN
        const response = await verifyPin(pinString);

        // PIN đúng
        if (response.success && response.sessionId) {
          setStorageItem(STORAGE_KEY_SESSION, response.sessionId);
          setAttempts(0);
          clearPin();

          if (onSuccess) {
            onSuccess(response.sessionId);
          } else {
            router.push('/home');
          }
        }
      } catch (error) {
        // PIN sai
        const newAttempts = attemptsRef.current + 1;
        setAttempts(newAttempts);
        clearPin();

        if (error instanceof Error && error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Mã PIN không đúng. Vui lòng thử lại.');
        }

        // Kiểm tra có cần khóa không
        if (newAttempts >= maxAttempts) {
          activate(lockDurationSeconds);
          setAttempts(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    doSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFull, pin]);

  // Handler khi hết thời gian khóa
  const handleUnlock = useCallback(() => {
    deactivate();
    setErrorMessage('');
    clearPin();
  }, [deactivate, clearPin]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        {/* Lock Overlay */}
        {isLocked && lockUntil && (
          <LockOverlay lockUntil={lockUntil} onUnlock={handleUnlock} />
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
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
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Quản lý Chi tiêu
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Nhập mã PIN để đăng nhập
          </p>
        </div>

        {/* PIN Display */}
        <div className="mb-8">
          <PINDisplay pin={pin} />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Đang xác thực...
          </div>
        )}

        {/* PIN Keypad */}
        <PINKeypad
          onDigitPress={addDigit}
          onDelete={removeDigit}
          disabled={isLocked || isLoading}
        />

        {/* Attempts Indicator */}
        {attempts > 0 && !isLocked && (
          <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Còn {maxAttempts - attempts} lần thử
          </p>
        )}
      </div>
    </div>
  );
}
