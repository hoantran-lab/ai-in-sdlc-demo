// ============================================================
// Unit Test Script: Date Utilities (LIB-013)
// Test cases: UT-DAT-001 ~ UT-DAT-010 (10 cases)
// ============================================================

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { addDays, subDays, startOfDay } from 'date-fns';
import {
  formatDate,
  toISODateString,
  isFutureDate,
  getYesterday,
} from '@/src/lib/utils/date';
import { FORMAT_DATE_CASES, ISO_DATE_CASES } from '../data/utility-test-data';

const FAKE_TODAY = new Date(2026, 1, 26, 0, 0, 0); // 2026-02-26

// ──────────────────────────────────────
// formatDate (UT-DAT-001 ~ UT-DAT-003)
// ──────────────────────────────────────
describe('formatDate (LIB-013)', () => {
  it.each(FORMAT_DATE_CASES)(
    '$id: formatDate → "$expected"',
    ({ input, expected }) => {
      expect(formatDate(input)).toBe(expected);
    },
  );
});

// ──────────────────────────────────────
// toISODateString (UT-DAT-004 ~ UT-DAT-005)
// ──────────────────────────────────────
describe('toISODateString (LIB-013)', () => {
  it.each(ISO_DATE_CASES)(
    '$id: toISODateString → "$expected"',
    ({ input, expected }) => {
      expect(toISODateString(input)).toBe(expected);
    },
  );
});

// ──────────────────────────────────────
// isFutureDate (UT-DAT-006 ~ UT-DAT-009)
// ──────────────────────────────────────
describe('isFutureDate (LIB-013)', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.setSystemTime(FAKE_TODAY);
  });

  it('UT-DAT-006: Hôm nay → false (không phải tương lai)', () => {
    const today = new Date();
    expect(isFutureDate(today)).toBe(false);
  });

  it('UT-DAT-007: Hôm qua → false', () => {
    const yesterday = subDays(new Date(), 1);
    expect(isFutureDate(yesterday)).toBe(false);
  });

  it('UT-DAT-008: Ngày mai → true', () => {
    const tomorrow = addDays(new Date(), 1);
    expect(isFutureDate(tomorrow)).toBe(true);
  });

  it('UT-DAT-009: Tương lai xa (2099-12-31) → true', () => {
    const farFuture = new Date(2099, 11, 31);
    expect(isFutureDate(farFuture)).toBe(true);
  });
});

// ──────────────────────────────────────
// getYesterday (UT-DAT-010)
// ──────────────────────────────────────
describe('getYesterday (LIB-013)', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('UT-DAT-010: Hôm nay 2026-02-26 → trả về 2026-02-25', () => {
    vi.setSystemTime(FAKE_TODAY);
    const yesterday = getYesterday();
    const expected = startOfDay(new Date(2026, 1, 25));

    expect(startOfDay(yesterday).getTime()).toBe(expected.getTime());
  });
});
