# Thiết kế Phương thức Hệ thống - UC-01 (システム方式設計書)

**Mã chức năng:** UC-01  
**Tên chức năng:** Đăng nhập bằng mã PIN  
**Phiên bản:** 1.0  
**Ngày tạo:** 25/02/2026

---

## 📥 Input (Tài liệu tham chiếu)

| Tài liệu | Nội dung trích xuất |
|----------|---------------------|
| `srs_function_requirements.md` | UC-01: Đăng nhập bằng mã PIN, luồng chính/thay thế, tiêu chí nghiệm thu |
| `srs_nonfunction_requirements.md` | NFR-SEC-01~04 (Bảo mật), NFR-TECH-01~04 (Công nghệ) |
| `srs_business_requirements.md` | BO-02: Bảo vệ dữ liệu cá nhân |

---

## 1. Tổng quan Kiến trúc (システムアーキテクチャ概要)

**Mô hình:** Client-Side Rendering với Next.js App Router

```mermaid
flowchart TB
    subgraph Client["🖥️ Client (Browser/Mobile)"]
        UI["Màn hình nhập PIN<br/>(PINLogin Component)"]
        LocalState["useState<br/>- pin: string[]<br/>- attempts: number<br/>- isLocked: boolean<br/>- lockUntil: Date"]
        LocalStorage["localStorage<br/>- sessionId<br/>- lockUntil"]
    end
    
    subgraph Server["⚙️ Next.js Server"]
        APIRoute["API Route<br/>/api/auth/verify-pin"]
        EnvVar["process.env<br/>APP_PIN_HASH"]
        Bcrypt["bcrypt.compare()"]
    end
    
    subgraph Database["🗄️ SQLite/PostgreSQL"]
        LoginAttempts["login_attempts"]
        AppSessions["app_sessions"]
    end
    
    UI -->|"1. Nhập đủ 4 số"| APIRoute
    APIRoute -->|"2. Đọc hash"| EnvVar
    APIRoute -->|"3. So sánh"| Bcrypt
    APIRoute -->|"4a. Thành công"| AppSessions
    APIRoute -->|"4b. Ghi log"| LoginAttempts
    APIRoute -->|"5. Response"| UI
    UI -->|"6. Lưu session"| LocalStorage
```

---

## 2. Cấu hình Phần mềm (ソフトウェア構成)

| Phân loại | Tên | Phiên bản | Mục đích | Tham chiếu NFR |
|-----------|-----|-----------|----------|----------------|
| Framework | Next.js | 14.x | App Router, API Routes | NFR-TECH-04 |
| Language | TypeScript | 5.x | Type-safe development | NFR-TECH-04 |
| Styling | TailwindCSS | 3.x | UI styling | NFR-TECH-03 |
| Date Library | date-fns | 3.x | Xử lý ngày tháng | NFR-TECH-01 |
| Hash Library | bcrypt | 5.x | Hash mã PIN | NFR-SEC-02 |
| Runtime | Node.js | 20.x | Server runtime | - |

> ⚠️ **CẤM** sử dụng `moment.js` theo NFR-TECH-02

---

## 3. Phương thức Xử lý Cốt lõi (主要処理方式)

### 3.1 Sequence Diagram - Luồng chính

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 Mẹ (A1)
    participant C as 🖥️ PINLogin
    participant A as ⚙️ /api/auth/verify-pin
    participant E as 🔐 process.env
    participant DB as 🗄️ Database
    
    U->>C: Mở ứng dụng
    C->>C: Kiểm tra localStorage.lockUntil
    
    alt Đang bị khóa (lockUntil > now)
        C->>U: Hiển thị đếm ngược "Vui lòng đợi XX giây"
    else Không bị khóa
        C->>U: Hiển thị 4 ô nhập PIN (trống)
    end
    
    loop Nhập từng số (0-9)
        U->>C: Bấm số trên bàn phím
        C->>C: pin.push(digit), hiển thị ●
    end
    
    Note over C: Khi pin.length === 4
    
    C->>A: POST /api/auth/verify-pin {pin: "****"}
    A->>E: Đọc APP_PIN_HASH
    A->>A: bcrypt.compare(pin, APP_PIN_HASH)
    
    alt PIN đúng ✅
        A->>DB: INSERT app_sessions (sessionId, created_at, expires_at)
        A->>DB: INSERT login_attempts (success=true)
        A->>C: 200 OK {success: true, sessionId: "uuid"}
        C->>C: localStorage.setItem("sessionId", uuid)
        C->>U: Chuyển đến /home (< 1 giây theo NFR-PERF-01)
    else PIN sai ❌
        A->>DB: INSERT login_attempts (success=false)
        A->>C: 401 {success: false, message: "Mã PIN không đúng"}
        C->>C: attempts++, xóa pin[]
        C->>U: Hiển thị "Mã PIN không đúng. Vui lòng thử lại."
        
        alt attempts >= 3
            C->>C: isLocked=true, lockUntil=now+30s
            C->>C: localStorage.setItem("lockUntil", timestamp)
            C->>U: Hiển thị "Vui lòng đợi 30 giây" + đếm ngược
        end
    end
```

### 3.2 Sequence Diagram - Luồng thay thế (AF-01.2: Khóa tạm)

```mermaid
sequenceDiagram
    participant U as 👤 Mẹ (A1)
    participant C as 🖥️ PINLogin
    participant T as ⏱️ setInterval
    
    Note over C: attempts >= 3, kích hoạt khóa
    
    C->>C: isLocked = true
    C->>C: lockUntil = addSeconds(new Date(), 30)
    C->>U: Vô hiệu hóa bàn phím (opacity-50)
    C->>U: Hiển thị "Vui lòng đợi 30 giây"
    
    C->>T: Khởi tạo interval 1000ms
    
    loop Mỗi giây
        T->>C: tick
        C->>C: remainingSeconds = differenceInSeconds(lockUntil, now)
        C->>U: Cập nhật "Vui lòng đợi {remainingSeconds} giây"
        
        alt remainingSeconds <= 0
            C->>C: isLocked = false, attempts = 0
            C->>C: localStorage.removeItem("lockUntil")
            C->>T: clearInterval()
            C->>U: Bật lại bàn phím, xóa thông báo
        end
    end
```

---

## 4. Phương thức Xác thực (認証方式)

| Thuộc tính | Giá trị | Tham chiếu |
|------------|---------|------------|
| Loại xác thực | PIN-based (4 chữ số) | UC-01 |
| Lưu trữ PIN | Biến môi trường `APP_PIN_HASH` | NFR-SEC-01 |
| Thuật toán hash | bcrypt (cost factor 10) | NFR-SEC-02 |
| Số lần thử tối đa | 3 lần | NFR-SEC-03 |
| Thời gian khóa | 30 giây | NFR-SEC-03 |
| Che PIN nhập | Hiển thị ● thay vì số | NFR-SEC-04 |
| Session ID | UUID v4 | - |
| Session expiry | 24 giờ | - |

---

## 5. Biến môi trường (環境変数)

| Tên biến | Mô tả | Bắt buộc | Ví dụ |
|----------|-------|----------|-------|
| `APP_PIN_HASH` | Mã PIN đã hash bằng bcrypt | ✅ | `$2b$10$N9qo8uLOickgx2ZMRZoMy...` |

**Tạo hash cho PIN "1234":**
```bash
# Cài đặt bcrypt CLI
npm install -g bcrypt-cli

# Tạo hash
bcrypt hash 1234 --rounds 10
# Output: $2b$10$...
```

**File `.env.local`:**
```env
# ⚠️ KHÔNG commit file này lên Git
APP_PIN_HASH=$2b$10$N9qo8uLOickgx2ZMRZoMyeOq...
```

---

## 6. Chính sách Bảo mật (セキュリティ方式)

| Mục | Phương thức | Tham chiếu NFR |
|-----|-------------|----------------|
| Mã hóa PIN | bcrypt hash (một chiều) | NFR-SEC-02 |
| Lưu trữ PIN | `process.env` (KHÔNG hardcode) | NFR-SEC-01 |
| Che PIN nhập | Hiển thị ● | NFR-SEC-04 |
| Rate limiting | Khóa 30 giây sau 3 lần sai | NFR-SEC-03 |
| Session | UUID v4 trong localStorage | - |
| Logging | Ghi log attempts, **KHÔNG** ghi PIN | - |

---

## 7. Phương thức Xử lý Ngày/Giờ

> Theo NFR-TECH-01: **BẮT BUỘC** sử dụng `date-fns`

```typescript
import { addSeconds, differenceInSeconds, isBefore } from 'date-fns';

// Tính thời điểm hết khóa
const lockUntil = addSeconds(new Date(), 30);

// Tính số giây còn lại
const remaining = differenceInSeconds(lockUntil, new Date());

// Kiểm tra đã hết khóa chưa
const isStillLocked = isBefore(new Date(), lockUntil);
```
