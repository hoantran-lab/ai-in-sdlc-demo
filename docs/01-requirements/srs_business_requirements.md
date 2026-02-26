# SRS - Yêu cầu Nghiệp vụ (Business Requirements)

**Dự án:** Ứng dụng Quản lý Chi tiêu Gia đình  
**Phiên bản:** 1.0  
**Ngày tạo:** 24/02/2026  
**Nguồn:** Ghi chú cuộc họp với Mẹ

---

## 1. Bối cảnh & Vấn đề (Context & Problem Statement)

> *"Nhà mình dạo này tiêu pha lộn xộn quá..."*

Gia đình cần một công cụ đơn giản để:
- Theo dõi các khoản chi tiêu hàng ngày
- Bảo vệ dữ liệu khỏi trẻ nhỏ nghịch điện thoại
- Đánh giá tình hình tài chính cuối tháng để điều chỉnh chi tiêu

---

## 2. Tác nhân (Actors)

| ID | Tên | Vai trò | Mô tả |
|----|-----|---------|-------|
| A1 | Mẹ | Người dùng chính | Quản lý tài chính, nhập liệu và xem thống kê |

---

## 3. Danh mục Chi tiêu (Expense Categories)

Chuẩn hóa từ ghi chú của Mẹ:

| ID | Tên gốc (từ Mẹ) | Tên chuẩn hóa | Mã danh mục | Mô tả |
|----|-----------------|---------------|-------------|-------|
| C1 | "tiền đi chợ" | **Sinh hoạt phí** | `LIVING` | Thực phẩm, đồ dùng hàng ngày |
| C2 | "tiền học cho Bống" | **Giáo dục** | `EDUCATION` | Học phí, sách vở, đồ dùng học tập |
| C3 | "đi ăn cưới" | **Hiếu hỉ** | `CEREMONY` | Đám cưới, đám hỏi, ma chay |
| C4 | "biếu ông bà nội ngoại" | **Biếu tặng** | `FAMILY_GIFT` | Quà biếu người thân, ông bà |

---

## 4. Mục tiêu Nghiệp vụ (Business Objectives)

| ID | Mục tiêu | Chỉ số đo lường |
|----|----------|-----------------|
| BO-01 | Ghi nhận chi tiêu nhanh chóng | Thời gian nhập < 30 giây/khoản |
| BO-02 | Bảo vệ dữ liệu cá nhân | Có cơ chế xác thực trước khi truy cập |
| BO-03 | Hỗ trợ ra quyết định tài chính | Trực quan hóa dữ liệu cuối tháng |

---

## 5. Phạm vi Dự án (Project Scope)

### 5.1 Trong phạm vi (In Scope)
- Đăng nhập bằng mã PIN 4 số
- Nhập khoản chi tiêu theo danh mục
- Biểu đồ cột thống kê cuối tháng

### 5.2 Ngoài phạm vi (Out of Scope) - Phiên bản 1.0
- Quản lý thu nhập
- Đồng bộ nhiều thiết bị
- Xuất báo cáo PDF/Excel
- Nhắc nhở hạn mức chi tiêu

---

## 6. Các bên liên quan (Stakeholders)

| Vai trò | Tên | Kỳ vọng |
|---------|-----|---------|
| Người dùng chính | Mẹ | Ứng dụng đơn giản, dễ sử dụng |
| Người bảo trì | Con (Developer) | Code sạch, dễ mở rộng |
