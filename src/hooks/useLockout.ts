'use client';

import { useState, useCallback } from 'react';
import { addSeconds, isPast } from 'date-fns';
import { STORAGE_KEY_LOCKOUT } from '@/src/constants/auth';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from '@/src/lib/utils/storage';
import { useCountdown } from './useCountdown';

interface UseLockoutReturn {
  isLocked: boolean;
  lockUntil: Date | null;
  remainingSeconds: number;
  activate: (seconds: number) => void;
  deactivate: () => void;
}

/**
 * Đọc trạng thái khóa từ localStorage (lazy initializer, tránh setState trong effect).
 */
function getInitialLockState(storageKey: string): {
  isLocked: boolean;
  lockUntil: Date | null;
} {
  const stored = getStorageItem(storageKey);
  if (stored) {
    const storedDate = new Date(stored);
    if (!isPast(storedDate)) {
      return { isLocked: true, lockUntil: storedDate };
    }
    // Đã hết hạn → xóa
    removeStorageItem(storageKey);
  }
  return { isLocked: false, lockUntil: null };
}

/**
 * Hook quản lý trạng thái khóa tạm thời sau khi nhập sai PIN quá số lần.
 * Persist qua localStorage để giữ trạng thái khi refresh.
 */
export function useLockout(
  storageKey: string = STORAGE_KEY_LOCKOUT
): UseLockoutReturn {
  // Khởi tạo từ localStorage (lazy, tránh lỗi React 19 set-state-in-effect)
  const [lockUntil, setLockUntil] = useState<Date | null>(
    () => getInitialLockState(storageKey).lockUntil
  );
  const [isLocked, setIsLocked] = useState(
    () => getInitialLockState(storageKey).isLocked
  );

  // Callback khi countdown kết thúc
  const handleCountdownComplete = useCallback(() => {
    setIsLocked(false);
    setLockUntil(null);
    removeStorageItem(storageKey);
  }, [storageKey]);

  // Countdown timer
  const { remainingSeconds } = useCountdown(lockUntil, handleCountdownComplete);

  // Kích hoạt khóa
  const activate = useCallback(
    (seconds: number) => {
      const until = addSeconds(new Date(), seconds);
      setLockUntil(until);
      setIsLocked(true);
      setStorageItem(storageKey, until.toISOString());
      console.log('[Lockout] Kích hoạt khóa đến:', until);
    },
    [storageKey]
  );

  // Hủy khóa
  const deactivate = useCallback(() => {
    setLockUntil(null);
    setIsLocked(false);
    removeStorageItem(storageKey);
  }, [storageKey]);

  return {
    isLocked,
    lockUntil,
    remainingSeconds,
    activate,
    deactivate,
  };
}
