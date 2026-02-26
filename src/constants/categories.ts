// ============================================================
// Hằng số danh mục chi tiêu - UC-02
// ============================================================

export interface CategoryDefinition {
  readonly code: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
}

/** 4 danh mục chi tiêu cố định (C1~C4) */
export const CATEGORIES: readonly CategoryDefinition[] = [
  { code: 'LIVING', name: 'Sinh hoạt phí', icon: '🛒', color: '#10B981' },
  { code: 'EDUCATION', name: 'Giáo dục', icon: '📚', color: '#3B82F6' },
  { code: 'CEREMONY', name: 'Hiếu hỉ', icon: '💒', color: '#F59E0B' },
  { code: 'FAMILY_GIFT', name: 'Biếu tặng', icon: '🎁', color: '#EC4899' },
] as const;

/** Danh sách mã danh mục hợp lệ */
export const CATEGORY_CODES = CATEGORIES.map((c) => c.code);
