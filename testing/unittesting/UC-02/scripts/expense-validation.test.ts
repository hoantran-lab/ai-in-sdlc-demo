// ============================================================
// Unit Test Script: Zod Schema CreateExpenseSchema (LIB-011)
// Test cases: UT-ZOD-001 ~ UT-ZOD-009 (9 cases)
// ============================================================

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { CreateExpenseSchema } from '@/src/lib/validations/expense';
import {
  FAKE_TODAY,
  YESTERDAY_ISO,
  PAST_DATE_ISO,
  ZOD_VALID_FULL,
  ZOD_VALID_NO_NOTE,
  ZOD_NOTE_WHITESPACE,
  ZOD_NOTE_ONLY_SPACES,
  ZOD_WRONG_AMOUNT_TYPE,
  ZOD_ALL_VALID_CATEGORIES,
  ZOD_WRONG_DATE_FORMAT,
  ZOD_INVALID_MONTH,
  ZOD_END_OF_FEB,
} from '../data/zod-test-data';

describe('CreateExpenseSchema (LIB-011)', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.setSystemTime(FAKE_TODAY); // 2026-02-26
  });

  // ──────────────────────────────────────
  // Nhánh bình thường (正常系)
  // ──────────────────────────────────────
  it('UT-ZOD-001: Happy path đầy đủ → success, dữ liệu đúng', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_VALID_FULL);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(150000);
      expect(result.data.categoryCode).toBe('LIVING');
      expect(result.data.expenseDate).toBe(YESTERDAY_ISO);
      expect(result.data.note).toBe('Test');
    }
  });

  it('UT-ZOD-002: Không có note → success, note = undefined', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_VALID_NO_NOTE);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note).toBeUndefined();
    }
  });

  // ──────────────────────────────────────
  // Transform
  // ──────────────────────────────────────
  it('UT-ZOD-003: Note có khoảng trắng → trim', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_NOTE_WHITESPACE);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note).toBe('khoảng trắng');
    }
  });

  it('UT-ZOD-004: Note toàn khoảng trắng → trim → rỗng → undefined', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_NOTE_ONLY_SPACES);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note).toBeUndefined();
    }
  });

  // ──────────────────────────────────────
  // Nhánh ngoại lệ (異常系)
  // ──────────────────────────────────────
  it('UT-ZOD-005: Sai kiểu amount → error "Vui lòng nhập số tiền"', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_WRONG_AMOUNT_TYPE);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Vui lòng nhập số tiền');
    }
  });

  it('UT-ZOD-007: Sai format ngày (DD/MM/YYYY) → error "Ngày không hợp lệ"', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_WRONG_DATE_FORMAT);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Ngày không hợp lệ');
    }
  });

  it('UT-ZOD-008: Tháng 13 không tồn tại → error "Ngày không hợp lệ"', () => {
    const result = CreateExpenseSchema.safeParse(ZOD_INVALID_MONTH);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Ngày không hợp lệ');
    }
  });

  // ──────────────────────────────────────
  // Giá trị biên (境界値)
  // ──────────────────────────────────────
  it('UT-ZOD-006: Tất cả 4 category codes hợp lệ', () => {
    for (const code of ZOD_ALL_VALID_CATEGORIES) {
      const result = CreateExpenseSchema.safeParse({
        amount: 100000,
        categoryCode: code,
        expenseDate: YESTERDAY_ISO,
      });
      expect(result.success).toBe(true);
    }
  });

  it('UT-ZOD-009: Ngày cuối tháng 2 (28/02/2026, 2026 không nhuận) → hợp lệ', () => {
    // Đặt thời gian giả lập sang ngày 01/03/2026 để 28/02 là quá khứ
    vi.setSystemTime(new Date(2026, 2, 1)); // March 1, 2026
    const result = CreateExpenseSchema.safeParse(ZOD_END_OF_FEB);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expenseDate).toBe('2026-02-28');
    }
  });
});
