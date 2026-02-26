'use client';

import { useState, useCallback } from 'react';
import { PIN_LENGTH } from '@/src/constants/auth';

interface UsePINInputReturn {
  pin: string[];
  pinString: string;
  addDigit: (digit: string) => void;
  removeDigit: () => void;
  clearPin: () => void;
  isFull: boolean;
}

/**
 * Hook quản lý nhập mã PIN 4 số.
 *
 * @param maxLength - Độ dài PIN tối đa (default: PIN_LENGTH = 4)
 * @param onComplete - Callback khi nhập đủ số
 */
export function usePINInput(
  maxLength: number = PIN_LENGTH,
  onComplete?: (pin: string) => void
): UsePINInputReturn {
  const [pin, setPin] = useState<string[]>([]);

  // LGC-001: Thêm số vào PIN
  const addDigit = useCallback(
    (digit: string) => {
      // Bước 1: Kiểm tra đã đủ số chưa
      if (pin.length >= maxLength) return;

      // Bước 2: Kiểm tra input hợp lệ (chỉ số 0-9)
      if (!/^\d$/.test(digit)) return;

      // Bước 3: Thêm số vào mảng
      const newPin = [...pin, digit];
      setPin(newPin);

      // Bước 4: Trigger callback khi đủ số
      if (newPin.length === maxLength && onComplete) {
        onComplete(newPin.join(''));
      }
    },
    [pin, maxLength, onComplete]
  );

  // LGC-002: Xóa số cuối
  const removeDigit = useCallback(() => {
    if (pin.length === 0) return;
    setPin(pin.slice(0, -1));
  }, [pin]);

  // Xóa tất cả
  const clearPin = useCallback(() => {
    setPin([]);
  }, []);

  return {
    pin,
    pinString: pin.join(''),
    addDigit,
    removeDigit,
    clearPin,
    isFull: pin.length >= maxLength,
  };
}
