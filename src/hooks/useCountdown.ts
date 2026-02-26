'use client';

import { useState, useEffect, useRef } from 'react';
import { differenceInSeconds } from 'date-fns';

interface UseCountdownReturn {
  remainingSeconds: number;
  isActive: boolean;
}

/**
 * Hook đếm ngược từ một thời điểm target.
 * Sử dụng date-fns (NFR-TECH-01).
 *
 * @param targetDate - Thời điểm đích (kết thúc đếm ngược)
 * @param onComplete - Callback khi countdown kết thúc
 */
export function useCountdown(
  targetDate: Date | null,
  onComplete?: () => void
): UseCountdownReturn {
  // Khởi tạo với giá trị tính từ targetDate (tránh setState trong effect)
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!targetDate) return 0;
    return Math.max(0, differenceInSeconds(targetDate, new Date()));
  });

  // Ref cho callback để tránh re-render loop
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!targetDate) return;

    // Tính remaining hiện tại
    const calcRemaining = () =>
      Math.max(0, differenceInSeconds(targetDate, new Date()));

    const initial = calcRemaining();
    if (initial <= 0) {
      // Đã hết → gọi callback, không cần interval
      onCompleteRef.current?.();
      return;
    }

    // Interval đếm ngược mỗi 1 giây (setState trong callback được phép)
    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, 1000);

    // Tick ngay lập tức lần đầu (trong callback nên OK)
    const immediateTimeout = setTimeout(() => {
      setRemainingSeconds(calcRemaining());
    }, 0);

    return () => {
      clearInterval(interval);
      clearTimeout(immediateTimeout);
    };
  }, [targetDate]);

  return {
    remainingSeconds,
    isActive: remainingSeconds > 0,
  };
}
