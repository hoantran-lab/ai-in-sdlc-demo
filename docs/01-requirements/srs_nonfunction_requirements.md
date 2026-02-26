# SRS - Yêu cầu Phi chức năng (Non-Functional Requirements)

**Dự án:** Ứng dụng Quản lý Chi tiêu Gia đình  
**Phiên bản:** 1.0  
**Ngày tạo:** 24/02/2026

---

## 1. Yêu cầu Bảo mật (Security)

| ID | Yêu cầu | Mức độ | Ghi chú |
|----|---------|--------|---------|
| NFR-SEC-01 | Mã PIN 4 số KHÔNG được hardcode trong mã nguồn | **Bắt buộc** | Đọc từ `process.env` hoặc Database |
| NFR-SEC-02 | Mã PIN phải được lưu dạng Hash (nếu lưu DB) | **Bắt buộc** | Sử dụng bcrypt hoặc tương đương |
| NFR-SEC-03 | Khóa tạm sau 3 lần nhập sai PIN | Khuyến nghị | Thời gian khóa: 30 giây |
| NFR-SEC-04 | Không hiển thị mã PIN đã nhập (dùng dấu ●) | **Bắt buộc** | - |

---

## 2. Yêu cầu Hiệu năng (Performance)

| ID | Yêu cầu | Chỉ số | Ghi chú |
|----|---------|--------|---------|
| NFR-PERF-01 | Thời gian tải màn hình chính | < 2 giây | Sau khi đăng nhập |
| NFR-PERF-02 | Thời gian lưu chi tiêu | < 1 giây | Từ khi nhấn "Lưu" |
| NFR-PERF-03 | Thời gian render biểu đồ | < 3 giây | Với dữ liệu 1 tháng |

---

## 3. Yêu cầu Khả dụng (Usability)

| ID | Yêu cầu | Mức độ | Ghi chú |
|----|---------|--------|---------|
| NFR-USE-01 | Giao diện tiếng Việt hoàn toàn | **Bắt buộc** | Theo quy tắc dự án |
| NFR-USE-02 | Font size tối thiểu 16px | Khuyến nghị | Mẹ có thể đọc dễ dàng |
| NFR-USE-03 | Nút bấm tối thiểu 44x44px | Khuyến nghị | Chuẩn touch target mobile |
| NFR-USE-04 | Thao tác nhập chi tiêu < 30 giây | **Bắt buộc** | Từ mở app đến lưu xong |

---

## 4. Yêu cầu Công nghệ (Technology Constraints)

| ID | Yêu cầu | Mức độ | Ghi chú |
|----|---------|--------|---------|
| NFR-TECH-01 | Sử dụng `date-fns` cho xử lý ngày tháng | **Bắt buộc** | Theo quy tắc dự án |
| NFR-TECH-02 | **CẤM** sử dụng `moment.js` | **Bắt buộc** | Theo quy tắc dự án |
| NFR-TECH-03 | Styling bằng TailwindCSS | **Bắt buộc** | Theo quy tắc dự án |
| NFR-TECH-04 | Framework: Next.js + TypeScript | **Bắt buộc** | Đã có sẵn trong dự án |

---

## 5. Yêu cầu Bản địa hóa (Localization)

| ID | Yêu cầu | Ví dụ |
|----|---------|-------|
| NFR-L10N-01 | UI Text, Placeholder, Error message bằng tiếng Việt | "Vui lòng nhập số tiền" |
| NFR-L10N-02 | Comment trong code bằng tiếng Việt | `// Kiểm tra mã PIN` |
| NFR-L10N-03 | Tên biến/hàm bằng tiếng Anh (camelCase) | `handleSubmitExpense()` |
| NFR-L10N-04 | Tên Component bằng tiếng Anh (PascalCase) | `ExpenseForm`, `BarChart` |
| NFR-L10N-05 | Định dạng tiền Việt Nam | `1.000.000 đ` |
| NFR-L10N-06 | Định dạng ngày Việt Nam | `24/02/2026` |

---

## 6. Yêu cầu Tương thích (Compatibility)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-COMP-01 | Hỗ trợ trình duyệt Chrome (mobile) | **Bắt buộc** |
| NFR-COMP-02 | Hỗ trợ Safari (iOS) | **Bắt buộc** |
| NFR-COMP-03 | Responsive cho màn hình 375px trở lên | **Bắt buộc** |

---

## 7. Yêu cầu Bảo trì (Maintainability)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-MAIN-01 | Code tuân thủ ESLint rules đã cấu hình | **Bắt buộc** |
| NFR-MAIN-02 | Mỗi Component < 200 dòng | Khuyến nghị |
| NFR-MAIN-03 | Tách biệt logic và UI (hooks/components) | Khuyến nghị |

---

## 8. Ma trận Ưu tiên

| Ưu tiên | Nhóm yêu cầu | Lý do |
|---------|--------------|-------|
| 1 | Bảo mật (SEC) | Bảo vệ dữ liệu tài chính gia đình |
| 2 | Khả dụng (USE) | Mẹ cần dùng dễ dàng |
| 3 | Công nghệ (TECH) | Tuân thủ quy tắc dự án |
| 4 | Hiệu năng (PERF) | Trải nghiệm mượt mà |
