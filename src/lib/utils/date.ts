// ============================================================
// Utility: Xử lý ngày tháng với date-fns (NFR-TECH-01)
// [CẤM] Không được dùng moment.js
// ============================================================

import { format, isAfter, startOfDay, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format Date sang chuỗi hiển thị
 * @example formatDate(new Date()) => "25/02/2026"
 */
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: vi });
}

/**
 * Format Date sang chuỗi ISO cho API
 * @example toISODateString(new Date()) => "2026-02-25"
 */
export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Kiểm tra ngày có trong tương lai không
 */
export function isFutureDate(date: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(new Date()));
}

/**
 * Lấy ngày hôm qua
 */
export function getYesterday(): Date {
  return subDays(new Date(), 1);
}
