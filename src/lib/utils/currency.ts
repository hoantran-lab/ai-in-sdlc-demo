// ============================================================
// Utility: Định dạng tiền VND (NFR-L10N-05)
// ============================================================

/**
 * Format số thành chuỗi tiền VND
 * @example formatCurrency(1500000) => "1.500.000 đ"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

/**
 * Parse chuỗi tiền thành số
 * @example parseCurrency("1.500.000") => 1500000
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/\D/g, ''), 10) || 0;
}
