// ============================================================
// Unit Test Script: Currency Utilities (LIB-012)
// Test cases: UT-CUR-001 ~ UT-CUR-011 (11 cases)
// ============================================================

import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrency } from '@/src/lib/utils/currency';
import { FORMAT_CURRENCY_CASES, PARSE_CURRENCY_CASES } from '../data/utility-test-data';

// ──────────────────────────────────────
// formatCurrency (UT-CUR-001 ~ UT-CUR-006)
// ──────────────────────────────────────
describe('formatCurrency (LIB-012)', () => {
  it.each(FORMAT_CURRENCY_CASES)(
    '$id: formatCurrency($input) → "$expected"',
    ({ input, expected }) => {
      expect(formatCurrency(input)).toBe(expected);
    },
  );
});

// ──────────────────────────────────────
// parseCurrency (UT-CUR-007 ~ UT-CUR-011)
// ──────────────────────────────────────
describe('parseCurrency (LIB-012)', () => {
  it.each(PARSE_CURRENCY_CASES)(
    '$id: parseCurrency("$input") → $expected',
    ({ input, expected }) => {
      expect(parseCurrency(input)).toBe(expected);
    },
  );
});
