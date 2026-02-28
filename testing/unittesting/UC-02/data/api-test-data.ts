// ============================================================
// Test Data: API Route POST /api/expenses (UT-EXP-001 ~ UT-EXP-038)
// ============================================================

import { addDays, subDays, format, startOfDay } from 'date-fns';

// ────────────────────────────────────────
// Ngày chuẩn (dùng cho tất cả test)
// Giả lập "hôm nay" = 2026-02-26
// ────────────────────────────────────────
export const FAKE_TODAY = new Date(2026, 1, 26, 0, 0, 0); // 2026-02-26T00:00:00
export const TODAY_ISO = '2026-02-26';
export const YESTERDAY_ISO = '2026-02-25';
export const TOMORROW_ISO = '2026-02-27';
export const PAST_DATE_ISO = '2026-02-20';

// ────────────────────────────────────────
// Mock Session
// ────────────────────────────────────────
export const VALID_SESSION_ID = 'valid-session-00000000-0000-0000-0000-000000000001';
export const EXPIRED_SESSION_ID = 'expired-session-00000000-0000-0000-0000-000000000002';
export const NON_EXISTENT_SESSION_ID = 'non-existent-uuid-00000000-0000-0000-0000';

export const MOCK_VALID_SESSION = {
  id: VALID_SESSION_ID,
  expiresAt: new Date(2026, 2, 26), // 1 tháng sau
  createdAt: new Date(2026, 1, 25),
};

export const MOCK_EXPIRED_SESSION = {
  id: EXPIRED_SESSION_ID,
  expiresAt: new Date(2026, 1, 24), // Đã hết hạn
  createdAt: new Date(2026, 1, 20),
};

// ────────────────────────────────────────
// Mock Category
// ────────────────────────────────────────
export const MOCK_CATEGORY_LIVING = {
  code: 'LIVING',
  name: 'Sinh hoạt phí',
  icon: '🛒',
  color: '#10B981',
  sortOrder: 0,
  isActive: true,
  createdAt: new Date(2026, 0, 1),
  updatedAt: new Date(2026, 0, 1),
};

export const MOCK_CATEGORY_EDUCATION = {
  code: 'EDUCATION',
  name: 'Giáo dục',
  icon: '📚',
  color: '#3B82F6',
  sortOrder: 1,
  isActive: true,
  createdAt: new Date(2026, 0, 1),
  updatedAt: new Date(2026, 0, 1),
};

export const MOCK_CATEGORY_CEREMONY = {
  code: 'CEREMONY',
  name: 'Hiếu hỉ',
  icon: '💒',
  color: '#F59E0B',
  sortOrder: 2,
  isActive: true,
  createdAt: new Date(2026, 0, 1),
  updatedAt: new Date(2026, 0, 1),
};

export const MOCK_CATEGORY_FAMILY_GIFT = {
  code: 'FAMILY_GIFT',
  name: 'Biếu tặng',
  icon: '🎁',
  color: '#EC4899',
  sortOrder: 3,
  isActive: true,
  createdAt: new Date(2026, 0, 1),
  updatedAt: new Date(2026, 0, 1),
};

// ────────────────────────────────────────
// Mock Created Expense (trả về từ prisma.create)
// ────────────────────────────────────────
export function makeMockCreatedExpense(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mock-expense-uuid-001',
    amount: 150000,
    categoryCode: 'LIVING',
    expenseDate: new Date(2026, 1, 25),
    note: 'Mua rau củ quả',
    isDeleted: false,
    createdAt: new Date(2026, 1, 26, 8, 30, 0),
    updatedAt: new Date(2026, 1, 26, 8, 30, 0),
    category: MOCK_CATEGORY_LIVING,
    ...overrides,
  };
}

// ────────────────────────────────────────
// Payloads: Nhánh bình thường (正常系)
// ────────────────────────────────────────

/** UT-EXP-025: Happy path đầy đủ */
export const PAYLOAD_VALID_FULL = {
  amount: 150000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: 'Mua rau củ quả',
};

/** UT-EXP-026: Không có note (optional) */
export const PAYLOAD_VALID_NO_NOTE = {
  amount: 500000,
  categoryCode: 'EDUCATION',
  expenseDate: PAST_DATE_ISO,
};

/** UT-EXP-027: Note chuỗi rỗng → null */
export const PAYLOAD_VALID_EMPTY_NOTE = {
  amount: 1000000,
  categoryCode: 'CEREMONY',
  expenseDate: '2026-01-15',
  note: '',
};

/** UT-EXP-028: Note có khoảng trắng đầu/cuối */
export const PAYLOAD_VALID_TRIMMED_NOTE = {
  amount: 2000000,
  categoryCode: 'FAMILY_GIFT',
  expenseDate: '2026-02-01',
  note: '  Biếu tặng ba mẹ  ',
};

// ────────────────────────────────────────
// Payloads: Zod Validation lỗi (異常系)
// ────────────────────────────────────────

/** UT-EXP-007: Object rỗng */
export const PAYLOAD_EMPTY_OBJECT = {};

/** UT-EXP-008: Sai kiểu dữ liệu tất cả field */
export const PAYLOAD_WRONG_TYPES = {
  amount: 'abc',
  categoryCode: 123,
  expenseDate: true,
};

/** UT-EXP-009: amount = 0 */
export const PAYLOAD_AMOUNT_ZERO = {
  amount: 0,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-010: amount âm */
export const PAYLOAD_AMOUNT_NEGATIVE = {
  amount: -1,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-013: amount > MAX_AMOUNT */
export const PAYLOAD_AMOUNT_OVER_MAX = {
  amount: 1000000000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-014: categoryCode không hợp lệ */
export const PAYLOAD_INVALID_CATEGORY = {
  amount: 100000,
  categoryCode: 'INVALID_CODE',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-015: categoryCode rỗng */
export const PAYLOAD_EMPTY_CATEGORY = {
  amount: 100000,
  categoryCode: '',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-016: ngày không hợp lệ */
export const PAYLOAD_INVALID_DATE = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: 'not-a-date',
};

/** UT-EXP-017: ngày tương lai xa */
export const PAYLOAD_FUTURE_DATE_FAR = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: '2099-12-31',
};

/** UT-EXP-018: ngày chuỗi rỗng */
export const PAYLOAD_EMPTY_DATE = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: '',
};

/** UT-EXP-020: note > 200 ký tự */
export const PAYLOAD_NOTE_OVER_MAX = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: 'a'.repeat(201),
};

// ────────────────────────────────────────
// Payloads: Giá trị biên (境界値)
// ────────────────────────────────────────

/** UT-EXP-011: amount = MIN_AMOUNT (1) */
export const PAYLOAD_AMOUNT_MIN = {
  amount: 1,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-012: amount = MAX_AMOUNT (999,999,999) */
export const PAYLOAD_AMOUNT_MAX = {
  amount: 999999999,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-019: note = 200 ký tự (đúng MAX) */
export const PAYLOAD_NOTE_MAX = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: 'a'.repeat(200),
};

/** UT-EXP-022: ngày mai */
export const PAYLOAD_DATE_TOMORROW = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: TOMORROW_ISO,
};

/** UT-EXP-023: ngày hôm nay */
export const PAYLOAD_DATE_TODAY = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: TODAY_ISO,
};

/** UT-EXP-024: ngày hôm qua */
export const PAYLOAD_DATE_YESTERDAY = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

// ────────────────────────────────────────
// Payloads: Dữ liệu rác / Tấn công (不正データ)
// ────────────────────────────────────────

/** UT-EXP-030: XSS trong note */
export const PAYLOAD_XSS_NOTE = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: "<script>alert('XSS')</script>",
};

/** UT-EXP-031: SQL Injection trong categoryCode */
export const PAYLOAD_SQLI_CATEGORY = {
  amount: 100000,
  categoryCode: "'; DROP TABLE trn_expenses; --",
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-032: SQL Injection trong note */
export const PAYLOAD_SQLI_NOTE = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: "'; DROP TABLE trn_expenses; --",
};

/** UT-EXP-033: all null */
export const PAYLOAD_ALL_NULL = {
  amount: null,
  categoryCode: null,
  expenseDate: null,
};

/** UT-EXP-035: Infinity */
export const PAYLOAD_INFINITY = {
  amount: Infinity,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-037: Số thập phân */
export const PAYLOAD_DECIMAL_AMOUNT = {
  amount: 1.5,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
};

/** UT-EXP-038: Extra fields */
export const PAYLOAD_EXTRA_FIELDS = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  extraField: 'hacker',
  admin: true,
};
