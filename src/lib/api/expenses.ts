// ============================================================
// API client: Chi tiêu - UC-02
// ============================================================

import { CreateExpenseRequest, ExpenseResponse } from '@/src/types/expense';
import { getStorageItem } from '@/src/lib/utils/storage';
import { STORAGE_KEY_SESSION } from '@/src/constants/auth';

/**
 * Gọi API tạo chi tiêu mới
 * @throws Error khi có lỗi từ server
 */
export async function createExpense(
  data: CreateExpenseRequest
): Promise<ExpenseResponse> {
  const sessionId = getStorageItem(STORAGE_KEY_SESSION);

  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId ? { 'X-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify(data),
  });

  const result: ExpenseResponse = await response.json();

  if (!response.ok || !result.success) {
    const error = new Error(result.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    (error as Error & { statusCode: number }).statusCode = response.status;
    throw error;
  }

  return result;
}
