# SRS - Yêu cầu Chức năng (Functional Requirements)

**Dự án:** Ứng dụng Quản lý Chi tiêu Gia đình  
**Phiên bản:** 1.0  
**Ngày tạo:** 24/02/2026

---

## 1. Tổng quan Use Cases

| ID | Tên Use Case | Tác nhân | Độ ưu tiên |
|----|--------------|----------|------------|
| UC-01 | Đăng nhập bằng mã PIN | Mẹ (A1) | Cao |
| UC-02 | Nhập khoản chi tiêu | Mẹ (A1) | Cao |
| UC-03 | Xem biểu đồ thống kê | Mẹ (A1) | Trung bình |

---

## 2. Chi tiết Use Cases

### UC-01: Đăng nhập bằng mã PIN

| Thuộc tính | Nội dung |
|------------|----------|
| **ID** | UC-01 |
| **Tên** | Đăng nhập bằng mã PIN |
| **Mô tả** | Người dùng nhập mã PIN 4 số để xác thực và truy cập ứng dụng |
| **Tác nhân** | Mẹ (A1) |
| **Điều kiện tiên quyết** | Mã PIN đã được cấu hình trong hệ thống (biến môi trường/Database) |
| **Điều kiện kích hoạt** | Người dùng mở ứng dụng |

**Luồng chính (Main Flow):**

| Bước | Tác nhân | Hệ thống |
|------|----------|----------|
| 1 | Mở ứng dụng | Hiển thị màn hình nhập PIN với 4 ô số |
| 2 | Nhập lần lượt 4 chữ số | Hiển thị dấu `●` cho mỗi số đã nhập |
| 3 | - | Tự động xác thực khi đủ 4 số |
| 4 | - | Chuyển đến màn hình chính |

**Luồng thay thế (Alternative Flow):**

| ID | Điều kiện | Xử lý |
|----|-----------|-------|
| AF-01.1 | Nhập sai PIN | Hiển thị thông báo "Mã PIN không đúng", xóa ô nhập, cho phép thử lại |
| AF-01.2 | Nhập sai 3 lần liên tiếp | Khóa tạm 30 giây, hiển thị đếm ngược |

**Tiêu chí nghiệm thu (Acceptance Criteria):**

- [ ] **AC-01.1:** Màn hình hiển thị 4 ô nhập số riêng biệt
- [ ] **AC-01.2:** Chỉ chấp nhận ký tự số (0-9)
- [ ] **AC-01.3:** Nhập đúng PIN → Chuyển màn hình chính trong < 1 giây
- [ ] **AC-01.4:** Nhập sai PIN → Thông báo lỗi bằng tiếng Việt
- [ ] **AC-01.5:** Nhập sai 3 lần → Khóa 30 giây
- [ ] **AC-01.6:** Mã PIN được so sánh qua biến môi trường (KHÔNG hardcode)

---

### UC-02: Nhập khoản chi tiêu

| Thuộc tính | Nội dung |
|------------|----------|
| **ID** | UC-02 |
| **Tên** | Nhập khoản chi tiêu |
| **Mô tả** | Ghi nhận các khoản chi tiêu vào các danh mục đã định nghĩa |
| **Tác nhân** | Mẹ (A1) |
| **Điều kiện tiên quyết** | Đã đăng nhập thành công (UC-01) |
| **Điều kiện kích hoạt** | Người dùng chọn "Thêm chi tiêu" |

**Luồng chính (Main Flow):**

| Bước | Tác nhân | Hệ thống |
|------|----------|----------|
| 1 | Nhấn nút "Thêm chi tiêu" | Hiển thị form nhập liệu |
| 2 | Chọn danh mục từ danh sách | Highlight danh mục được chọn |
| 3 | Nhập số tiền | Định dạng số tiền tự động (VD: 1.000.000) |
| 4 | (Tùy chọn) Nhập ghi chú | - |
| 5 | Nhấn "Lưu" | Lưu vào Database, hiển thị thông báo thành công |
| 6 | - | Quay về màn hình chính |

**Danh mục chi tiêu:**

| Mã | Tên hiển thị | Icon gợi ý |
|----|--------------|------------|
| `LIVING` | Sinh hoạt phí | 🛒 |
| `EDUCATION` | Giáo dục | 📚 |
| `CEREMONY` | Hiếu hỉ | 💒 |
| `FAMILY_GIFT` | Biếu tặng | 🎁 |

**Luồng thay thế (Alternative Flow):**

| ID | Điều kiện | Xử lý |
|----|-----------|-------|
| AF-02.1 | Không chọn danh mục | Hiển thị lỗi "Vui lòng chọn danh mục" |
| AF-02.2 | Số tiền <= 0 hoặc rỗng | Hiển thị lỗi "Số tiền không hợp lệ" |
| AF-02.3 | Nhấn "Hủy" | Quay về màn hình chính, không lưu |

**Tiêu chí nghiệm thu (Acceptance Criteria):**

- [ ] **AC-02.1:** Hiển thị đủ 4 danh mục với icon tương ứng
- [ ] **AC-02.2:** Số tiền chỉ chấp nhận số dương
- [ ] **AC-02.3:** Định dạng tiền Việt Nam (dấu chấm phân cách hàng nghìn)
- [ ] **AC-02.4:** Ngày chi tiêu mặc định là ngày hiện tại
- [ ] **AC-02.5:** Lưu thành công → Thông báo "Đã lưu thành công"
- [ ] **AC-02.6:** Ghi chú là trường tùy chọn (có thể bỏ trống)

---

### UC-03: Xem biểu đồ thống kê

| Thuộc tính | Nội dung |
|------------|----------|
| **ID** | UC-03 |
| **Tên** | Xem biểu đồ thống kê |
| **Mô tả** | Hiển thị biểu đồ cột tổng hợp chi tiêu theo danh mục trong tháng |
| **Tác nhân** | Mẹ (A1) |
| **Điều kiện tiên quyết** | Đã đăng nhập thành công (UC-01) |
| **Điều kiện kích hoạt** | Người dùng chọn "Thống kê" |

**Luồng chính (Main Flow):**

| Bước | Tác nhân | Hệ thống |
|------|----------|----------|
| 1 | Nhấn tab "Thống kê" | Truy vấn dữ liệu chi tiêu tháng hiện tại |
| 2 | - | Hiển thị biểu đồ cột theo danh mục |
| 3 | - | Hiển thị tổng chi tiêu tháng |
| 4 | (Tùy chọn) Chọn tháng khác | Cập nhật biểu đồ theo tháng được chọn |

**Luồng thay thế (Alternative Flow):**

| ID | Điều kiện | Xử lý |
|----|-----------|-------|
| AF-03.1 | Không có dữ liệu trong tháng | Hiển thị "Chưa có dữ liệu chi tiêu" |

**Tiêu chí nghiệm thu (Acceptance Criteria):**

- [ ] **AC-03.1:** Biểu đồ cột hiển thị tất cả danh mục (kể cả = 0)
- [ ] **AC-03.2:** Mỗi cột có màu sắc khác nhau theo danh mục
- [ ] **AC-03.3:** Hiển thị số tiền trên đỉnh mỗi cột
- [ ] **AC-03.4:** Hiển thị tổng chi tiêu tháng bên dưới biểu đồ
- [ ] **AC-03.5:** Có thể chọn xem tháng trước
- [ ] **AC-03.6:** Sử dụng `date-fns` để xử lý ngày tháng (KHÔNG dùng moment.js)

---

## 3. Ma trận Truy vết (Traceability Matrix)

| Use Case | Business Objective | Danh mục liên quan |
|----------|-------------------|-------------------|
| UC-01 | BO-02 (Bảo vệ dữ liệu) | - |
| UC-02 | BO-01 (Ghi nhận nhanh) | C1, C2, C3, C4 |
| UC-03 | BO-03 (Hỗ trợ quyết định) | C1, C2, C3, C4 |
