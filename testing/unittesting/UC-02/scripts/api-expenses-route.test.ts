// ============================================================
// Unit Test Script: POST /api/expenses (LGC-015)
// Test cases: UT-EXP-001 ~ UT-EXP-038 (29 cases)
// ============================================================

import { describe, it, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import {
  FAKE_TODAY,
  VALID_SESSION_ID,
  NON_EXISTENT_SESSION_ID,
  EXPIRED_SESSION_ID,
  MOCK_VALID_SESSION,
  MOCK_CATEGORY_LIVING,
  MOCK_CATEGORY_EDUCATION,
  MOCK_CATEGORY_CEREMONY,
  MOCK_CATEGORY_FAMILY_GIFT,
  makeMockCreatedExpense,
  PAYLOAD_VALID_FULL,
  PAYLOAD_VALID_NO_NOTE,
  PAYLOAD_VALID_EMPTY_NOTE,
  PAYLOAD_VALID_TRIMMED_NOTE,
  PAYLOAD_EMPTY_OBJECT,
  PAYLOAD_WRONG_TYPES,
  PAYLOAD_AMOUNT_ZERO,
  PAYLOAD_AMOUNT_NEGATIVE,
  PAYLOAD_AMOUNT_OVER_MAX,
  PAYLOAD_INVALID_CATEGORY,
  PAYLOAD_EMPTY_CATEGORY,
  PAYLOAD_INVALID_DATE,
  PAYLOAD_FUTURE_DATE_FAR,
  PAYLOAD_EMPTY_DATE,
  PAYLOAD_NOTE_OVER_MAX,
  PAYLOAD_AMOUNT_MIN,
  PAYLOAD_AMOUNT_MAX,
  PAYLOAD_NOTE_MAX,
  PAYLOAD_DATE_TOMORROW,
  PAYLOAD_DATE_TODAY,
  PAYLOAD_DATE_YESTERDAY,
  PAYLOAD_XSS_NOTE,
  PAYLOAD_SQLI_CATEGORY,
  PAYLOAD_SQLI_NOTE,
  PAYLOAD_ALL_NULL,
  PAYLOAD_INFINITY,
  PAYLOAD_DECIMAL_AMOUNT,
  PAYLOAD_EXTRA_FIELDS,
  TODAY_ISO,
  YESTERDAY_ISO,
} from '../data/api-test-data';

// ────────────────────────────────────────
// Prisma Mock (hoisted)
// ────────────────────────────────────────
const { mockSessionFindFirst, mockCategoryFindFirst, mockExpenseCreate } = vi.hoisted(() => ({
  mockSessionFindFirst: vi.fn(),
  mockCategoryFindFirst: vi.fn(),
  mockExpenseCreate: vi.fn(),
}));

vi.mock('@/src/lib/prisma', () => ({
  default: {
    app_sessions: { findFirst: mockSessionFindFirst },
    mst_categories: { findFirst: mockCategoryFindFirst },
    trn_expenses: { create: mockExpenseCreate },
  },
}));

// Import handler SAU khi mock
import { POST } from '@/app/api/expenses/route';

// ────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────

/**
 * Tạo NextRequest cho test
 * @param body - Nội dung body (object → JSON.stringify, string → raw)
 * @param sessionId - Giá trị header X-Session-Id (null/undefined → không đặt)
 */
function createRequest(body?: unknown, sessionId?: string | null): NextRequest {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (typeof sessionId === 'string') {
    headers.set('X-Session-Id', sessionId);
  }
  const init: RequestInit = { method: 'POST', headers };
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  return new NextRequest('http://localhost:3000/api/expenses', init);
}

/** Thiết lập session hợp lệ */
function setupValidSession() {
  mockSessionFindFirst.mockResolvedValueOnce(MOCK_VALID_SESSION);
}

/** Thiết lập luồng thành công hoàn chỉnh */
function setupSuccessfulFlow(
  category = MOCK_CATEGORY_LIVING,
  expense = makeMockCreatedExpense(),
) {
  setupValidSession();
  mockCategoryFindFirst.mockResolvedValueOnce(category);
  mockExpenseCreate.mockResolvedValueOnce(expense);
}

// ============================================================
// TESTS
// ============================================================
describe('POST /api/expenses (LGC-015)', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.setSystemTime(FAKE_TODAY); // 2026-02-26T00:00:00
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────
  // 3.1.1. BƯỚC 1 — Kiểm tra Session
  // ──────────────────────────────────────
  describe('BƯỚC 1: Kiểm tra Session (Authentication)', () => {
    it('UT-EXP-001: Không có header X-Session-Id → 401', async () => {
      const req = createRequest(PAYLOAD_VALID_FULL); // sessionId = undefined
      const res = await POST(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      });
      // Không được gọi DB
      expect(mockSessionFindFirst).not.toHaveBeenCalled();
    });

    it('UT-EXP-002: X-Session-Id chuỗi rỗng → 401', async () => {
      const req = createRequest(PAYLOAD_VALID_FULL, '');
      const res = await POST(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      });
      expect(mockSessionFindFirst).not.toHaveBeenCalled();
    });

    it('UT-EXP-003: Session không tồn tại trong DB → 401', async () => {
      mockSessionFindFirst.mockResolvedValueOnce(null);
      const req = createRequest(PAYLOAD_VALID_FULL, NON_EXISTENT_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Phiên đăng nhập đã hết hạn',
      });
      expect(mockSessionFindFirst).toHaveBeenCalledWith({
        where: {
          id: NON_EXISTENT_SESSION_ID,
          expiresAt: { gt: expect.any(Date) },
        },
      });
    });

    it('UT-EXP-004: Session đã hết hạn → 401', async () => {
      mockSessionFindFirst.mockResolvedValueOnce(null); // DB trả null cho session hết hạn
      const req = createRequest(PAYLOAD_VALID_FULL, EXPIRED_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Phiên đăng nhập đã hết hạn',
      });
    });
  });

  // ──────────────────────────────────────
  // 3.1.2. BƯỚC 2 — Parse Request Body
  // ──────────────────────────────────────
  describe('BƯỚC 2: Parse Request Body', () => {
    it('UT-EXP-005: Body không phải JSON hợp lệ → 400', async () => {
      setupValidSession();
      const req = createRequest('not-json-string', VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });
    });

    it('UT-EXP-006: Không gửi body → 400', async () => {
      setupValidSession();
      const req = createRequest(undefined, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });
    });
  });

  // ──────────────────────────────────────
  // 3.1.3. BƯỚC 3 — Zod Validation
  // ──────────────────────────────────────
  describe('BƯỚC 3: Zod Validation', () => {
    it('UT-EXP-007: Object rỗng → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_EMPTY_OBJECT, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBeDefined();
    });

    it('UT-EXP-008: Sai kiểu dữ liệu tất cả field → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_WRONG_TYPES, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-009: amount = 0 → 400 "Số tiền phải lớn hơn 0"', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_AMOUNT_ZERO, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Số tiền phải lớn hơn 0');
    });

    it('UT-EXP-010: amount âm → 400 "Số tiền phải lớn hơn 0"', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_AMOUNT_NEGATIVE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Số tiền phải lớn hơn 0');
    });

    it('UT-EXP-011: amount = MIN_AMOUNT (1) → 201', async () => {
      const mockExpense = makeMockCreatedExpense({ amount: 1, note: null });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_AMOUNT_MIN, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.amount).toBe(1);
      expect(body.data.amountFormatted).toBe('1 đ');
    });

    it('UT-EXP-012: amount = MAX_AMOUNT (999,999,999) → 201', async () => {
      const mockExpense = makeMockCreatedExpense({ amount: 999999999, note: null });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_AMOUNT_MAX, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.amount).toBe(999999999);
      expect(body.data.amountFormatted).toBe('999.999.999 đ');
    });

    it('UT-EXP-013: amount > MAX_AMOUNT → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_AMOUNT_OVER_MAX, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Số tiền không được vượt quá');
    });

    it('UT-EXP-014: categoryCode không nằm trong danh sách → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_INVALID_CATEGORY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Danh mục không hợp lệ');
    });

    it('UT-EXP-015: categoryCode chuỗi rỗng → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_EMPTY_CATEGORY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Danh mục không hợp lệ');
    });

    it('UT-EXP-016: expenseDate không hợp lệ → 400 "Ngày không hợp lệ"', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_INVALID_DATE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Ngày không hợp lệ');
    });

    it('UT-EXP-017: Ngày tương lai xa → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_FUTURE_DATE_FAR, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Ngày chi tiêu không được trong tương lai');
    });

    it('UT-EXP-018: expenseDate chuỗi rỗng → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_EMPTY_DATE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-019: note = 200 ký tự (MAX_NOTE_LENGTH) → 201', async () => {
      const mockExpense = makeMockCreatedExpense({ note: 'a'.repeat(200) });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_NOTE_MAX, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.note).toBe('a'.repeat(200));
    });

    it('UT-EXP-020: note = 201 ký tự → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_NOTE_OVER_MAX, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Ghi chú không được vượt quá 200 ký tự');
    });
  });

  // ──────────────────────────────────────
  // 3.1.4. BƯỚC 4 — Business Validation bổ sung
  // ──────────────────────────────────────
  describe('BƯỚC 4: Business Validation bổ sung', () => {
    it('UT-EXP-021: Category bị isActive=false → 400', async () => {
      setupValidSession();
      mockCategoryFindFirst.mockResolvedValueOnce(null); // DB trả null cho category inactive
      const req = createRequest(PAYLOAD_VALID_FULL, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Danh mục không tồn tại hoặc đã bị vô hiệu',
      });
    });

    it('UT-EXP-022: Ngày mai → 400 "Ngày chi tiêu không được trong tương lai"', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_DATE_TOMORROW, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Ngày chi tiêu không được trong tương lai');
    });

    it('UT-EXP-023: Ngày hôm nay → 201', async () => {
      const mockExpense = makeMockCreatedExpense({
        expenseDate: new Date(2026, 1, 26),
        note: null,
      });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_DATE_TODAY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.expenseDate).toBe(TODAY_ISO);
    });

    it('UT-EXP-024: Ngày hôm qua → 201', async () => {
      const mockExpense = makeMockCreatedExpense({
        expenseDate: new Date(2026, 1, 25),
        note: null,
      });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_DATE_YESTERDAY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.expenseDate).toBe(YESTERDAY_ISO);
    });
  });

  // ──────────────────────────────────────
  // 3.1.5. BƯỚC 5+6 — Tạo chi tiêu & Response
  // ──────────────────────────────────────
  describe('BƯỚC 5+6: Tạo chi tiêu & Response thành công', () => {
    it('UT-EXP-025: Happy path đầy đủ → 201 với dữ liệu đúng', async () => {
      const mockExpense = makeMockCreatedExpense();
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_VALID_FULL, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Đã lưu chi tiêu thành công');
      expect(body.data).toEqual({
        id: mockExpense.id,
        amount: mockExpense.amount,
        amountFormatted: '150.000 đ',
        categoryCode: 'LIVING',
        categoryName: 'Sinh hoạt phí',
        categoryIcon: '🛒',
        expenseDate: '2026-02-25',
        expenseDateFormatted: '25/02/2026',
        note: 'Mua rau củ quả',
        createdAt: mockExpense.createdAt.toISOString(),
      });

      // Kiểm tra Prisma được gọi đúng
      expect(mockExpenseCreate).toHaveBeenCalledWith({
        data: {
          amount: 150000,
          categoryCode: 'LIVING',
          expenseDate: expect.any(Date),
          note: 'Mua rau củ quả',
        },
        include: { category: true },
      });
    });

    it('UT-EXP-026: Không có note → 201 với note: null', async () => {
      const mockExpense = makeMockCreatedExpense({
        amount: 500000,
        categoryCode: 'EDUCATION',
        expenseDate: new Date(2026, 1, 20),
        note: null,
        category: MOCK_CATEGORY_EDUCATION,
      });
      setupSuccessfulFlow(MOCK_CATEGORY_EDUCATION, mockExpense);
      const req = createRequest(PAYLOAD_VALID_NO_NOTE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.note).toBeNull();
      expect(body.data.categoryName).toBe('Giáo dục');
      expect(body.data.categoryIcon).toBe('📚');
    });

    it('UT-EXP-027: Note chuỗi rỗng → 201 với note: null (Zod transform)', async () => {
      const mockExpense = makeMockCreatedExpense({
        amount: 1000000,
        categoryCode: 'CEREMONY',
        expenseDate: new Date(2026, 0, 15),
        note: null,
        category: MOCK_CATEGORY_CEREMONY,
      });
      setupSuccessfulFlow(MOCK_CATEGORY_CEREMONY, mockExpense);
      const req = createRequest(PAYLOAD_VALID_EMPTY_NOTE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.data.note).toBeNull();

      // Prisma nhận note: null (undefined → ?? null)
      expect(mockExpenseCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ note: null }),
        }),
      );
    });

    it('UT-EXP-028: Note có khoảng trắng → 201 với note đã trim', async () => {
      const mockExpense = makeMockCreatedExpense({
        amount: 2000000,
        categoryCode: 'FAMILY_GIFT',
        expenseDate: new Date(2026, 1, 1),
        note: 'Biếu tặng ba mẹ',
        category: MOCK_CATEGORY_FAMILY_GIFT,
      });
      setupSuccessfulFlow(MOCK_CATEGORY_FAMILY_GIFT, mockExpense);
      const req = createRequest(PAYLOAD_VALID_TRIMMED_NOTE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.data.note).toBe('Biếu tặng ba mẹ');
      expect(body.data.categoryName).toBe('Biếu tặng');
      expect(body.data.categoryIcon).toBe('🎁');
    });
  });

  // ──────────────────────────────────────
  // 3.1.6. BƯỚC 7 — Xử lý lỗi hệ thống
  // ──────────────────────────────────────
  describe('BƯỚC 7: Xử lý lỗi hệ thống', () => {
    it('UT-EXP-029: Prisma create ném Error → 500', async () => {
      setupValidSession();
      mockCategoryFindFirst.mockResolvedValueOnce(MOCK_CATEGORY_LIVING);
      mockExpenseCreate.mockRejectedValueOnce(new Error('DB connection lost'));

      const req = createRequest(PAYLOAD_VALID_FULL, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      });
    });
  });

  // ──────────────────────────────────────
  // 3.1.7. Dữ liệu không hợp lệ / Tấn công
  // ──────────────────────────────────────
  describe('Dữ liệu không hợp lệ / Tấn công (不正データ)', () => {
    it('UT-EXP-030: XSS trong note → 201, note lưu nguyên dạng text', async () => {
      const xssNote = "<script>alert('XSS')</script>";
      const mockExpense = makeMockCreatedExpense({ note: xssNote });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_XSS_NOTE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      // Note được lưu nguyên dạng text (JSON response, không bị execute)
      expect(body.data.note).toBe(xssNote);
      // Response content-type là application/json, không phải text/html
      expect(res.headers.get('content-type')).toContain('application/json');
    });

    it('UT-EXP-031: SQL Injection trong categoryCode → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_SQLI_CATEGORY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Danh mục không hợp lệ');
      // DB KHÔNG được gọi (Zod chặn trước)
      expect(mockCategoryFindFirst).not.toHaveBeenCalled();
    });

    it('UT-EXP-032: SQL Injection trong note → 201, note lưu nguyên', async () => {
      const sqliNote = "'; DROP TABLE trn_expenses; --";
      const mockExpense = makeMockCreatedExpense({ note: sqliNote });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_SQLI_NOTE, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.data.note).toBe(sqliNote);
    });

    it('UT-EXP-033: Tất cả field = null → 400', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_ALL_NULL, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-034: Tất cả field = undefined → 400 (JSON.stringify loại bỏ → {})', async () => {
      setupValidSession();
      const payload = { amount: undefined, categoryCode: undefined, expenseDate: undefined };
      const req = createRequest(payload, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-035: amount = Infinity → 400 (JSON serialize thành null)', async () => {
      setupValidSession();
      const req = createRequest(PAYLOAD_INFINITY, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-036: amount = NaN → 400 (JSON serialize thành null)', async () => {
      setupValidSession();
      const payload = { amount: NaN, categoryCode: 'LIVING', expenseDate: YESTERDAY_ISO };
      const req = createRequest(payload, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it('UT-EXP-037: amount = 1.5 (số thập phân) → 201 (Zod chấp nhận number)', async () => {
      const mockExpense = makeMockCreatedExpense({ amount: 1.5, note: null });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_DECIMAL_AMOUNT, VALID_SESSION_ID);
      const res = await POST(req);

      // Zod chấp nhận (number, ≥1, ≤MAX). Prisma mock không kiểm tra Int.
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    it('UT-EXP-038: Extra fields → 201, Zod loại bỏ field thừa', async () => {
      const mockExpense = makeMockCreatedExpense({ note: null });
      setupSuccessfulFlow(MOCK_CATEGORY_LIVING, mockExpense);
      const req = createRequest(PAYLOAD_EXTRA_FIELDS, VALID_SESSION_ID);
      const res = await POST(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      // extraField và admin KHÔNG xuất hiện trong response
      expect(body.data.extraField).toBeUndefined();
      expect(body.data.admin).toBeUndefined();
    });
  });
});
