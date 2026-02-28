// ============================================================
// Test Data: Utility Functions (UT-CUR-*, UT-DAT-*)
// ============================================================

// ────────────────────────────────────────
// formatCurrency test data (UT-CUR-001 ~ UT-CUR-006)
// ────────────────────────────────────────
export const FORMAT_CURRENCY_CASES = [
  { id: 'UT-CUR-001', input: 1500000, expected: '1.500.000 đ' },
  { id: 'UT-CUR-002', input: 50000, expected: '50.000 đ' },
  { id: 'UT-CUR-003', input: 0, expected: '0 đ' },
  { id: 'UT-CUR-004', input: 1, expected: '1 đ' },
  { id: 'UT-CUR-005', input: 999999999, expected: '999.999.999 đ' },
  { id: 'UT-CUR-006', input: -100000, expected: '-100.000 đ' },
];

// ────────────────────────────────────────
// parseCurrency test data (UT-CUR-007 ~ UT-CUR-011)
// ────────────────────────────────────────
export const PARSE_CURRENCY_CASES = [
  { id: 'UT-CUR-007', input: '1.500.000', expected: 1500000 },
  { id: 'UT-CUR-008', input: '50000', expected: 50000 },
  { id: 'UT-CUR-009', input: '', expected: 0 },
  { id: 'UT-CUR-010', input: 'abcxyz', expected: 0 },
  { id: 'UT-CUR-011', input: '1.500.000 đ', expected: 1500000 },
];

// ────────────────────────────────────────
// formatDate test data (UT-DAT-001 ~ UT-DAT-003)
// ────────────────────────────────────────
export const FORMAT_DATE_CASES = [
  { id: 'UT-DAT-001', input: new Date(2026, 1, 25), expected: '25/02/2026' },
  { id: 'UT-DAT-002', input: new Date(2026, 0, 1), expected: '01/01/2026' },
  { id: 'UT-DAT-003', input: new Date(2026, 11, 31), expected: '31/12/2026' },
];

// ────────────────────────────────────────
// toISODateString test data (UT-DAT-004 ~ UT-DAT-005)
// ────────────────────────────────────────
export const ISO_DATE_CASES = [
  { id: 'UT-DAT-004', input: new Date(2026, 1, 25), expected: '2026-02-25' },
  { id: 'UT-DAT-005', input: new Date(2026, 0, 1), expected: '2026-01-01' },
];
