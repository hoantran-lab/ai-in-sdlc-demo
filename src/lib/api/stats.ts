// ============================================================
// API client: Thống kê - UC-03
// ============================================================

import type { MonthlyStatsResponse } from '@/src/types/stats';
import { getStorageItem } from '@/src/lib/utils/storage';
import { STORAGE_KEY_SESSION } from '@/src/constants/auth';

/**
 * Gọi API lấy thống kê chi tiêu theo tháng
 * @param month Format YYYY-MM
 * @throws Error khi có lỗi từ server
 */
export async function fetchMonthlyStats(
  month: string
): Promise<MonthlyStatsResponse> {
  const sessionId = getStorageItem(STORAGE_KEY_SESSION);

  const response = await fetch(`/api/stats/monthly?month=${month}`, {
    method: 'GET',
    headers: {
      ...(sessionId ? { 'X-Session-Id': sessionId } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Không thể tải dữ liệu thống kê');
  }

  return result as MonthlyStatsResponse;
}
