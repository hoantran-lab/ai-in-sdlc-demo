// ============================================================
// Hook: useCategories - Lấy danh mục chi tiêu (HK-011)
// ============================================================

import { CATEGORIES, type CategoryDefinition } from '@/src/constants/categories';

/**
 * Hook trả về danh sách danh mục chi tiêu.
 * Hiện tại lấy từ constants (4 danh mục cố định).
 * Có thể mở rộng để fetch từ API nếu cần.
 */
export function useCategories(): {
  categories: readonly CategoryDefinition[];
  isLoading: false;
} {
  return {
    categories: CATEGORIES,
    isLoading: false,
  };
}
