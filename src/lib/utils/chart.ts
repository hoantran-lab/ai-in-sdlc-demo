// ============================================================
// Utility: Transform data cho Recharts (LGC-024)
// ============================================================

import type { CategoryStat, ChartData } from '@/src/types/stats';

/**
 * Transform CategoryStat[] → ChartData[] cho Recharts BarChart
 */
export function transformToChartData(categories: CategoryStat[]): ChartData[] {
  if (!categories || categories.length === 0) return [];

  return categories.map((cat) => ({
    name: `${cat.icon} ${getShortName(cat.name)}`,
    value: cat.total,
    color: cat.color,
    displayValue: formatShortCurrency(cat.total),
  }));
}

/**
 * Rút gọn tên danh mục
 * "Sinh hoạt phí" → "Sinh hoạt"
 * "Biếu tặng gia đình" → "Biếu tặng"
 */
function getShortName(name: string): string {
  const words = name.split(' ');
  if (words.length > 2) {
    return words.slice(0, 2).join(' ');
  }
  return name;
}

/**
 * Format số tiền rút gọn cho label biểu đồ
 * 1500000 → "1.5tr"
 * 500000 → "500k"
 * 50000 → "50k"
 */
export function formatShortCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return millions % 1 === 0
      ? `${millions}tr`
      : `${millions.toFixed(1)}tr`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k`;
  }
  return amount.toString();
}
