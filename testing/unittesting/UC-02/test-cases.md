# Tài liệu Đặc tả Kiểm thử Đơn vị - UC-02 (単体テスト仕様書)

**Mã chức năng:** UC-02  
**Tên chức năng:** Thêm chi tiêu mới  
**Đối tượng test:** API Backend `POST /api/expenses` (LGC-015), Zod Schema (LIB-011), Utility Functions (LIB-012, LIB-013)  
**Người thiết kế test (作成者):** QA Automation Agent  
**Môi trường Test (テスト環境):** Local / Vitest + Prisma Mock  
**Ngày tạo:** 2026-02-26

---

## 1. Tiêu chuẩn bao phủ (カバレッジ基準)

| Tiêu chuẩn | Mục tiêu | Mô tả |
|-------------|----------|-------|
| **C0 (Statement Coverage)** | 100% | Mọi dòng code đều được chạy qua ít nhất 1 lần |
| **C1 (Branch Coverage)** | 100% | Mọi luồng IF/ELSE, try/catch đều được test |

---

## 2. Tham chiếu Source Code ↔ Thiết kế

| Logic ID | File Source Code | Tham chiếu thiết kế |
|----------|-----------------|---------------------|
| LGC-015 | `app/api/expenses/route.ts` | `docs/03-internal-design/UC-02/02_Shori_Logic.md` §2.6 |
| LIB-011 | `src/lib/validations/expense.ts` | `docs/03-internal-design/UC-02/01_Program_Sekkei.md` §7 |
| LIB-012 | `src/lib/utils/currency.ts` | `docs/03-internal-design/UC-02/02_Shori_Logic.md` §5 |
| LIB-013 | `src/lib/utils/date.ts` | `docs/03-internal-design/UC-02/02_Shori_Logic.md` §6 |

---

## 3. Danh sách Test Case (テストケース一覧)

### 3.1. API Route: `POST /api/expenses` (LGC-015)

#### 3.1.1. BƯỚC 1 — Kiểm tra Session (Authentication)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-001 | Nhánh ngoại lệ (異常系) | — | Header `X-Session-Id` không có | Gửi POST `/api/expenses` không có header `X-Session-Id` | HTTP 401. Body: `{ success: false, message: "Vui lòng đăng nhập để tiếp tục" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | C1: Nhánh `!sessionId` |
| UT-EXP-002 | Nhánh ngoại lệ (異常系) | — | Header `X-Session-Id: ""` (chuỗi rỗng) | Gửi POST `/api/expenses` với `X-Session-Id` = `""` | HTTP 401. Body: `{ success: false, message: "Vui lòng đăng nhập để tiếp tục" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Chuỗi rỗng cũng falsy |
| UT-EXP-003 | Nhánh ngoại lệ (異常系) | DB không có session này | Header `X-Session-Id: "non-existent-uuid"` | Gửi POST với session ID không tồn tại trong DB | HTTP 401. Body: `{ success: false, message: "Phiên đăng nhập đã hết hạn" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | C1: Nhánh `!session` |
| UT-EXP-004 | Nhánh ngoại lệ (異常系) | Session tồn tại nhưng `expiresAt` < now | Header `X-Session-Id: "expired-session-id"` | Gửi POST với session đã hết hạn | HTTP 401. Body: `{ success: false, message: "Phiên đăng nhập đã hết hạn" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Session expired |

#### 3.1.2. BƯỚC 2 — Parse Request Body

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-005 | Nhánh ngoại lệ (異常系) | Session hợp lệ | Body = `"not-json-string"` (không phải JSON) | Gửi POST với body không phải JSON hợp lệ | HTTP 400. Body: `{ success: false, message: "Dữ liệu không hợp lệ" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | C1: catch block `request.json()` |
| UT-EXP-006 | Nhánh ngoại lệ (異常系) | Session hợp lệ | Body rỗng (không gửi body) | Gửi POST không có body | HTTP 400. Body: `{ success: false, message: "Dữ liệu không hợp lệ" }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |

#### 3.1.3. BƯỚC 3 — Zod Validation

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-007 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ }` (object rỗng) | Gửi POST với body rỗng | HTTP 400. Message chứa thông báo validation lỗi | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Thiếu tất cả field bắt buộc |
| UT-EXP-008 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: "abc", categoryCode: 123, expenseDate: true }` | Gửi POST với sai kiểu dữ liệu tất cả field | HTTP 400. Message chứa thông báo lỗi kiểu dữ liệu | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Sai kiểu dữ liệu |
| UT-EXP-009 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 0, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = 0 | HTTP 400. Message: `"Số tiền phải lớn hơn 0"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: amount = 0 < MIN_AMOUNT(1) |
| UT-EXP-010 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: -1, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount âm | HTTP 400. Message: `"Số tiền phải lớn hơn 0"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Giá trị âm |
| UT-EXP-011 | Giá trị biên (境界値) | Session hợp lệ | `{ amount: 1, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = MIN_AMOUNT (1) | HTTP 201 (pass validation, nếu các field khác OK) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: amount = MIN_AMOUNT |
| UT-EXP-012 | Giá trị biên (境界値) | Session hợp lệ, category LIVING tồn tại | `{ amount: 999999999, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = MAX_AMOUNT | HTTP 201. `amountFormatted: "999.999.999 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: amount = MAX_AMOUNT |
| UT-EXP-013 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 1000000000, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = MAX_AMOUNT + 1 | HTTP 400. Message chứa `"Số tiền không được vượt quá"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: amount > MAX_AMOUNT |
| UT-EXP-014 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "INVALID_CODE", expenseDate: "2026-02-25" }` | Gửi POST với categoryCode không nằm trong danh sách | HTTP 400. Message: `"Danh mục không hợp lệ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Zod refine categoryCode |
| UT-EXP-015 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "", expenseDate: "2026-02-25" }` | Gửi POST với categoryCode rỗng | HTTP 400. Message: `"Danh mục không hợp lệ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Chuỗi rỗng |
| UT-EXP-016 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "not-a-date" }` | Gửi POST với ngày không hợp lệ | HTTP 400. Message: `"Ngày không hợp lệ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | refine Date.parse = NaN |
| UT-EXP-017 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2099-12-31" }` | Gửi POST với ngày trong tương lai xa | HTTP 400. Message: `"Ngày chi tiêu không được trong tương lai"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Zod refine isAfter |
| UT-EXP-018 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "" }` | Gửi POST với expenseDate chuỗi rỗng | HTTP 400. Message chứa thông báo lỗi ngày | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Chuỗi rỗng cho ngày |
| UT-EXP-019 | Giá trị biên (境界値) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "<ngày hôm nay>", note: "a".repeat(200) }` | Gửi POST với note đúng 200 ký tự (MAX_NOTE_LENGTH) | HTTP 201. Lưu thành công | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: note.length = MAX |
| UT-EXP-020 | Nhánh ngoại lệ (異常系) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "<ngày hôm nay>", note: "a".repeat(201) }` | Gửi POST với note 201 ký tự | HTTP 400. Message chứa `"Ghi chú không được vượt quá 200 ký tự"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: note.length > MAX |

#### 3.1.4. BƯỚC 4 — Business Validation bổ sung

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-021 | Nhánh ngoại lệ (異常系) | Session hợp lệ. Category `LIVING` bị `isActive=false` trong DB | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với category đã bị vô hiệu | HTTP 400. Message: `"Danh mục không tồn tại hoặc đã bị vô hiệu"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | C1: Nhánh `!category` |
| UT-EXP-022 | Giá trị biên (境界値) | Session hợp lệ, category LIVING active | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "<ngày mai>" }` | Gửi POST với ngày = ngày mai (startOfDay) | HTTP 400. Message: `"Ngày chi tiêu không được trong tương lai"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: expenseDate = tomorrow. Double-check isAfter |
| UT-EXP-023 | Giá trị biên (境界値) | Session hợp lệ, category LIVING active | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "<ngày hôm nay>" }` | Gửi POST với ngày = ngày hôm nay | HTTP 201. Lưu thành công | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: expenseDate = today (cho phép) |
| UT-EXP-024 | Giá trị biên (境界値) | Session hợp lệ, category LIVING active | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "<ngày hôm qua>" }` | Gửi POST với ngày = ngày hôm qua | HTTP 201. Lưu thành công | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Quá khứ → phải cho phép |

#### 3.1.5. BƯỚC 5+6 — Tạo chi tiêu & Response thành công (正常系)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-025 | Nhánh bình thường (正常系) | Session hợp lệ, category LIVING active | `{ amount: 150000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "Mua rau củ quả" }` | Gửi POST đầy đủ thông tin | HTTP 201. Body: `{ success: true, message: "Đã lưu chi tiêu thành công", data: { id: <UUID>, amount: 150000, amountFormatted: "150.000 đ", categoryCode: "LIVING", categoryName: "Sinh hoạt phí", categoryIcon: "🛒", expenseDate: "2026-02-25", expenseDateFormatted: "25/02/2026", note: "Mua rau củ quả", createdAt: <ISO string> } }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Happy path đầy đủ |
| UT-EXP-026 | Nhánh bình thường (正常系) | Session hợp lệ, category EDUCATION active | `{ amount: 500000, categoryCode: "EDUCATION", expenseDate: "2026-02-20" }` | Gửi POST không có note (optional) | HTTP 201. Body chứa `note: null`, `categoryName: "Giáo dục"`, `categoryIcon: "📚"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Không gửi note |
| UT-EXP-027 | Nhánh bình thường (正常系) | Session hợp lệ, category CEREMONY active | `{ amount: 1000000, categoryCode: "CEREMONY", expenseDate: "2026-01-15", note: "" }` | Gửi POST với note chuỗi rỗng | HTTP 201. Body chứa `note: null` (Zod transform trim → undefined → null) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | note rỗng → biến thành null |
| UT-EXP-028 | Nhánh bình thường (正常系) | Session hợp lệ, category FAMILY_GIFT active | `{ amount: 2000000, categoryCode: "FAMILY_GIFT", expenseDate: "2026-02-01", note: "  Biếu tặng ba mẹ  " }` | Gửi POST với note có khoảng trắng đầu/cuối | HTTP 201. Body chứa `note: "Biếu tặng ba mẹ"` (đã trim) hoặc note chứa khoảng trắng (tùy Zod transform) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Test Zod transform trim |

#### 3.1.6. BƯỚC 7 — Xử lý lỗi hệ thống (Error Handling)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-029 | Nhánh ngoại lệ (異常系) | Mock Prisma `create` ném Error | Dữ liệu hợp lệ | Gửi POST, mock DB lỗi khi INSERT | HTTP 500. Body: `{ success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại sau." }` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | C1: catch block ngoài cùng |

#### 3.1.7. Dữ liệu không hợp lệ / Tấn công (Invalid Data / Negative Testing)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-EXP-030 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "<script>alert('XSS')</script>" }` | Gửi POST với note chứa XSS payload | HTTP 201 hoặc 400. Nếu 201 thì note phải được lưu dạng text thuần (không execute). Response không chứa `<script>` dưới dạng HTML đã render | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | XSS trong note |
| UT-EXP-031 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: 100000, categoryCode: "'; DROP TABLE trn_expenses; --", expenseDate: "2026-02-25" }` | Gửi POST với SQL Injection trong categoryCode | HTTP 400. Message: `"Danh mục không hợp lệ"`. DB không bị ảnh hưởng | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | SQL Injection (Zod + Prisma chặn) |
| UT-EXP-032 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "'; DROP TABLE trn_expenses; --" }` | Gửi POST với SQL Injection trong note | HTTP 201. Note được lưu nguyên dạng text. DB không bị ảnh hưởng | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | SQL Injection trong note (Prisma parameterized) |
| UT-EXP-033 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: null, categoryCode: null, expenseDate: null }` | Gửi POST với tất cả field = null | HTTP 400. Trả về thông báo lỗi validation | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Null values |
| UT-EXP-034 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: undefined, categoryCode: undefined, expenseDate: undefined }` | Gửi POST với tất cả field = undefined (bị loại khi JSON.stringify) | HTTP 400. Trả về thông báo lỗi validation | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Undefined → missing fields |
| UT-EXP-035 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: Infinity, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = Infinity | HTTP 400. Zod reject vì không phải số hữu hạn hoặc > MAX_AMOUNT | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-EXP-036 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: NaN, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = NaN | HTTP 400. Zod reject (NaN serialize thành null trong JSON) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | NaN → null trong JSON |
| UT-EXP-037 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: 1.5, categoryCode: "LIVING", expenseDate: "2026-02-25" }` | Gửi POST với amount = số thập phân | HTTP 201 hoặc 400. Nếu 201 thì amount phải lưu đúng (VND không có lẻ, kiểm tra behavior) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Số thập phân — Zod chấp nhận number, Prisma Int sẽ truncate |
| UT-EXP-038 | Dữ liệu rác (不正データ) | Session hợp lệ | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25", extraField: "hacker", admin: true }` | Gửi POST với các field thừa không nằm trong schema | HTTP 201. Các field thừa bị Zod bỏ qua, chỉ lưu đúng field hợp lệ | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Extra fields → stripped by Zod |

---

### 3.2. Zod Schema: `CreateExpenseSchema` (LIB-011)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-ZOD-001 | Nhánh bình thường (正常系) | — | `{ amount: 150000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "Test" }` | Gọi `CreateExpenseSchema.safeParse(data)` | `success: true`. `data.amount = 150000`, `data.note = "Test"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Happy path |
| UT-ZOD-002 | Nhánh bình thường (正常系) | — | `{ amount: 100000, categoryCode: "EDUCATION", expenseDate: "2026-02-20" }` | Gọi `safeParse` không có note | `success: true`. `data.note = undefined` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | note optional |
| UT-ZOD-003 | Transform | — | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "  khoảng trắng  " }` | Gọi `safeParse` | `success: true`. `data.note = "khoảng trắng"` (trim) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Zod transform trim |
| UT-ZOD-004 | Transform | — | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-25", note: "   " }` | Gọi `safeParse` với note toàn khoảng trắng | `success: true`. `data.note = undefined` (trim → rỗng → undefined) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Zod transform: trim rỗng |
| UT-ZOD-005 | Nhánh ngoại lệ (異常系) | — | `{ amount: "hello" }` | Gọi `safeParse` | `success: false`. Issue chứa `"Vui lòng nhập số tiền"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Sai kiểu |
| UT-ZOD-006 | Giá trị biên (境界値) | — | Lần lượt test 4 mã: `"LIVING"`, `"EDUCATION"`, `"CEREMONY"`, `"FAMILY_GIFT"` | Gọi `safeParse` cho từng mã danh mục hợp lệ | Tất cả `success: true` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Tất cả 4 category code |
| UT-ZOD-007 | Nhánh ngoại lệ (異常系) | — | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "31/02/2026" }` | Gọi `safeParse` với ngày sai format (DD/MM/YYYY thay vì YYYY-MM-DD) | `success: false`. Issue: `"Ngày không hợp lệ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Sai format ngày |
| UT-ZOD-008 | Nhánh ngoại lệ (異常系) | — | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-13-01" }` | Gọi `safeParse` với tháng 13 | `success: false`. Issue: `"Ngày không hợp lệ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Tháng không tồn tại |
| UT-ZOD-009 | Giá trị biên (境界値) | — | `{ amount: 100000, categoryCode: "LIVING", expenseDate: "2026-02-28" }` | Gọi `safeParse` với ngày cuối tháng 2 | `success: true` (nếu ngày ≤ hôm nay) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Ngày cuối tháng 2 (2026 không nhuận) |

---

### 3.3. Utility: `formatCurrency` (LIB-012)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-CUR-001 | Nhánh bình thường (正常系) | — | `1500000` | Gọi `formatCurrency(1500000)` | `"1.500.000 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-CUR-002 | Nhánh bình thường (正常系) | — | `50000` | Gọi `formatCurrency(50000)` | `"50.000 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-CUR-003 | Giá trị biên (境界値) | — | `0` | Gọi `formatCurrency(0)` | `"0 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: zero |
| UT-CUR-004 | Giá trị biên (境界値) | — | `1` | Gọi `formatCurrency(1)` | `"1 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: MIN_AMOUNT |
| UT-CUR-005 | Giá trị biên (境界値) | — | `999999999` | Gọi `formatCurrency(999999999)` | `"999.999.999 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: MAX_AMOUNT |
| UT-CUR-006 | Giá trị biên (境界値) | — | `-100000` | Gọi `formatCurrency(-100000)` | `"-100.000 đ"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Số âm |

### 3.4. Utility: `parseCurrency` (LIB-012)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-CUR-007 | Nhánh bình thường (正常系) | — | `"1.500.000"` | Gọi `parseCurrency("1.500.000")` | `1500000` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-CUR-008 | Nhánh bình thường (正常系) | — | `"50000"` | Gọi `parseCurrency("50000")` | `50000` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Không có dấu chấm |
| UT-CUR-009 | Giá trị biên (境界値) | — | `""` | Gọi `parseCurrency("")` | `0` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Chuỗi rỗng → 0 (fallback `\|\| 0`) |
| UT-CUR-010 | Dữ liệu rác (不正データ) | — | `"abcxyz"` | Gọi `parseCurrency("abcxyz")` | `0` (parseInt = NaN → `\|\| 0`) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Chữ thuần |
| UT-CUR-011 | Nhánh bình thường (正常系) | — | `"1.500.000 đ"` | Gọi `parseCurrency("1.500.000 đ")` | `1500000` (loại bỏ ký tự không phải số) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Có suffix " đ" |

### 3.5. Utility: `formatDate` (LIB-013)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-DAT-001 | Nhánh bình thường (正常系) | — | `new Date(2026, 1, 25)` (25/02/2026) | Gọi `formatDate(date)` | `"25/02/2026"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-DAT-002 | Giá trị biên (境界値) | — | `new Date(2026, 0, 1)` (01/01/2026) | Gọi `formatDate(date)` | `"01/01/2026"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Ngày đầu năm |
| UT-DAT-003 | Giá trị biên (境界値) | — | `new Date(2026, 11, 31)` (31/12/2026) | Gọi `formatDate(date)` | `"31/12/2026"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Ngày cuối năm |

### 3.6. Utility: `toISODateString` (LIB-013)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-DAT-004 | Nhánh bình thường (正常系) | — | `new Date(2026, 1, 25)` | Gọi `toISODateString(date)` | `"2026-02-25"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |
| UT-DAT-005 | Giá trị biên (境界値) | — | `new Date(2026, 0, 1)` | Gọi `toISODateString(date)` | `"2026-01-01"` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Đầu năm |

### 3.7. Utility: `isFutureDate` (LIB-013)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-DAT-006 | Giá trị biên (境界値) | — | `new Date()` (hôm nay) | Gọi `isFutureDate(today)` | `false` (hôm nay KHÔNG phải tương lai) | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Boundary: today |
| UT-DAT-007 | Nhánh bình thường (正常系) | — | `subDays(new Date(), 1)` (hôm qua) | Gọi `isFutureDate(yesterday)` | `false` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Quá khứ |
| UT-DAT-008 | Nhánh bình thường (正常系) | — | `addDays(new Date(), 1)` (ngày mai) | Gọi `isFutureDate(tomorrow)` | `true` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Tương lai |
| UT-DAT-009 | Giá trị biên (境界値) | — | `new Date(2099, 11, 31)` | Gọi `isFutureDate(farFuture)` | `true` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | Tương lai xa |

### 3.8. Utility: `getYesterday` (LIB-013)

| ID Test Case | Phân loại (観点) | Tiền điều kiện (事前条件) | Dữ liệu đầu vào (入力データ) | Các bước thực hiện (手順) | Kết quả mong đợi (期待値) | Kết quả thực tế (実際結果) | Đánh giá (判定) | Ngày test (実施日) | Người test (実施者) | Ghi chú (備考) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT-DAT-010 | Nhánh bình thường (正常系) | Hôm nay 2026-02-26 | — | Gọi `getYesterday()` | Kết quả là Date tương đương `2026-02-25` | Khớp kỳ vọng | PASS | 2026-02-26 | QA Agent (Vitest) | |

---

## 4. Tổng hợp (サマリー)

| Nhóm | Số Test Case | Bình thường (正常系) | Ngoại lệ (異常系) | Giá trị biên (境界値) | Dữ liệu rác (不正データ) | Kết quả |
|------|-------------|---------------------|-------------------|----------------------|--------------------------|---------|
| API Route `POST /api/expenses` | 38 | 4 | 16 | 9 | 9 | ✅ 38/38 PASS |
| Zod Schema `CreateExpenseSchema` | 9 | 2 | 3 | 2 | 2 | ✅ 9/9 PASS |
| `formatCurrency` | 6 | 2 | 0 | 3 | 1 | ✅ 6/6 PASS |
| `parseCurrency` | 5 | 3 | 0 | 1 | 1 | ✅ 5/5 PASS |
| `formatDate` | 3 | 1 | 0 | 2 | 0 | ✅ 3/3 PASS |
| `toISODateString` | 2 | 1 | 0 | 1 | 0 | ✅ 2/2 PASS |
| `isFutureDate` | 4 | 2 | 0 | 2 | 0 | ✅ 4/4 PASS |
| `getYesterday` | 1 | 1 | 0 | 0 | 0 | ✅ 1/1 PASS |
| **Tổng cộng** | **68** | **16** | **19** | **20** | **13** | **✅ 68/68 PASS** |

> **Ngày chạy test:** 2026-02-26 | **Vitest v4.0.18** | **Duration:** 999ms | **Evidence:** `testevidence/evidence_20260226_2215.txt`
