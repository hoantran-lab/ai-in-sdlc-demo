// ============================================================
// Test Data: Zod Schema CreateExpenseSchema (UT-ZOD-001 ~ UT-ZOD-009)
// ============================================================

export const FAKE_TODAY = new Date(2026, 1, 26, 0, 0, 0);
export const YESTERDAY_ISO = '2026-02-25';
export const PAST_DATE_ISO = '2026-02-20';

/** UT-ZOD-001: Happy path đầy đủ */
export const ZOD_VALID_FULL = {
  amount: 150000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: 'Test',
};

/** UT-ZOD-002: Không có note */
export const ZOD_VALID_NO_NOTE = {
  amount: 100000,
  categoryCode: 'EDUCATION',
  expenseDate: PAST_DATE_ISO,
};

/** UT-ZOD-003: Note có khoảng trắng */
export const ZOD_NOTE_WHITESPACE = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: '  khoảng trắng  ',
};

/** UT-ZOD-004: Note toàn khoảng trắng */
export const ZOD_NOTE_ONLY_SPACES = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: YESTERDAY_ISO,
  note: '   ',
};

/** UT-ZOD-005: Sai kiểu amount */
export const ZOD_WRONG_AMOUNT_TYPE = {
  amount: 'hello',
};

/** UT-ZOD-006: Tất cả 4 category codes hợp lệ */
export const ZOD_ALL_VALID_CATEGORIES = ['LIVING', 'EDUCATION', 'CEREMONY', 'FAMILY_GIFT'];

/** UT-ZOD-007: Sai format ngày (DD/MM/YYYY thay vì YYYY-MM-DD) */
export const ZOD_WRONG_DATE_FORMAT = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: '31/02/2026',
};

/** UT-ZOD-008: Tháng 13 không tồn tại */
export const ZOD_INVALID_MONTH = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: '2026-13-01',
};

/** UT-ZOD-009: Ngày cuối tháng 2 (2026 không nhuận) */
export const ZOD_END_OF_FEB = {
  amount: 100000,
  categoryCode: 'LIVING',
  expenseDate: '2026-02-28',
};
