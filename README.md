# 🏠 Quản lý Chi tiêu Gia đình — AI-in-SDLC Demo

> **Demo thực tế** việc sử dụng AI (GitHub Copilot + Custom Instructions, Skills, Agents) xuyên suốt vòng đời phát triển phần mềm — từ phân tích yêu cầu, thiết kế, lập trình, đến kiểm thử.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Mục lục

- [Giới thiệu dự án](#-giới-thiệu-dự-án)
- [Kiến trúc AI-in-SDLC](#-kiến-trúc-ai-in-sdlc)
- [Cài đặt môi trường](#-cài-đặt-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Tìm hiểu Skills & Agents](#-tìm-hiểu-skills--agents)
- [Tài liệu dự án](#-tài-liệu-dự-án)
- [Tech Stack](#-tech-stack)
- [Kiểm thử (Testing)](#-kiểm-thử-testing)
- [Database Schema](#-database-schema)

---

## 🎯 Giới thiệu dự án

**Bối cảnh:** Một bà mẹ cần ứng dụng đơn giản trên điện thoại để:
- Ghi nhanh chi tiêu hàng ngày (tiền chợ, học phí, hiếu hỉ, biếu tặng)
- Đăng nhập bằng mã PIN 4 số cho tiện
- Cuối tháng xem biểu đồ để biết tiêu bao nhiêu

**Điểm đặc biệt:** Toàn bộ quy trình từ phân tích → thiết kế → code → kiểm thử đều do **AI (GitHub Copilot)** thực hiện, được điều khiển bởi hệ thống **Custom Instructions**, **Skills** và **Agents** tự định nghĩa.

### 🚦 Trạng thái dự án

```
✅ Phân tích yêu cầu ──▶ ✅ Thiết kế cơ bản ──▶ ✅ Thiết kế chi tiết ──▶ ✅ Lập trình ──▶ ✅ Unit Test ──▶ 🔄 Integration Test
```

### Chức năng

| UC | Tên | Mô tả |
|----|-----|-------|
| UC-01 | 🔐 Đăng nhập PIN | Nhập mã PIN 4 số, khóa 30s sau 3 lần sai |
| UC-02 | 💰 Thêm chi tiêu | Chọn danh mục, nhập số tiền, chọn ngày, ghi chú |
| UC-03 | 📊 Xem thống kê | Biểu đồ cột theo tháng, tổng chi tiêu, phần trăm danh mục |

### 4 danh mục chi tiêu

| Icon | Danh mục | Mã |
|------|----------|----|
| 🛒 | Sinh hoạt phí | `LIVING` |
| 📚 | Giáo dục | `EDUCATION` |
| 💒 | Hiếu hỉ | `CEREMONY` |
| 🎁 | Biếu tặng gia đình | `FAMILY_GIFT` |

---

## 🤖 Kiến trúc AI-in-SDLC

Dự án này demo cách tổ chức Copilot để AI tham gia vào **toàn bộ** Software Development Life Cycle:

```
📝 Meeting Notes (đầu vào thô)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  .github/copilot-instructions.md  (Hiến pháp dự án)    │
│  ─ Quy tắc ngôn ngữ, tech stack, bảo mật              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Skills (Kỹ năng chuyên biệt):                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ req-analyzer │→ │ external-    │→ │ internal-     │  │
│  │ (BA/Phân    │  │ design-      │  │ design-       │  │
│  │ tích y/c)   │  │ generator    │  │ generator     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         │                                    │          │
│         ▼                                    ▼          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         multi-agent-coder                        │   │
│  │   (Orchestrator điều phối code multi-agent)      │   │
│  │   ┌────────────┐ ┌────────┐ ┌──────────┐        │   │
│  │   │Scaffolding │→│ Coder  │→│ QA Agent │        │   │
│  │   │Agent       │ │ Agent  │ │          │        │   │
│  │   └────────────┘ └────────┘ └──────────┘        │   │
│  └──────────────────────────────────────────────────┘   │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Testing Skills                           │   │
│  │  ┌────────────────┐  ┌─────────────────────────┐ │   │
│  │  │ unit-testing    │  │ integration-test-       │ │   │
│  │  │ (UT cho từng UC)│  │ generator (IT xuyên UC) │ │   │
│  │  └────────────────┘  └─────────────────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  docs/01-requirements/  → docs/02-external-design/      │
│  → docs/03-internal-design/  → src/ → testing/          │
└─────────────────────────────────────────────────────────┘
```

**Luồng thực tế đã chạy trong dự án này:**

1. **Input:** File `family-meeting-notes.txt` — ghi chú cuộc họp gia đình bằng tiếng Việt tự nhiên
2. **Skill `req-analyzer`:** Phân tích → sinh 3 file SRS (business, functional, non-functional)
3. **Skill `external-design-generator`:** Đọc SRS → sinh thiết kế kiến trúc, màn hình, DB logic, API (OpenAPI YAML)
4. **Skill `internal-design-generator`:** Đọc external design → sinh pseudocode, class diagram, Prisma schema + tự kiểm tra tính khả thi (Feasibility Check)
5. **Skill `multi-agent-coder`:** Đọc internal design → điều phối Scaffolding → Coder → QA agents để sinh code
6. **Skill `unit-testing`:** Đọc internal design + source code → sinh test cases + test scripts (Vitest) cho từng UC
7. **Skill `integration-test-generator`:** Đọc requirements + external design → sinh kịch bản kiểm thử tích hợp xuyên suốt các UC (chuẩn IPA)

---

## ⚙️ Cài đặt môi trường

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | >= 20 |
| npm | >= 10 |
| VS Code | Latest |
| GitHub Copilot | Extension đã kích hoạt |

### Bước 1: Clone repository

```bash
git clone https://github.com/hoantran-lab/ai-in-sdlc-demo.git
cd ai-in-sdlc-demo/app-project
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` trong thư mục `app-project/`:

```env
# Database (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# PIN hash (bcrypt hash của mã PIN 4 số)
# Sinh hash bằng lệnh: node -e "require('bcrypt').hash('1234',10).then(h=>console.log(h))"
APP_PIN_HASH="<paste_bcrypt_hash_here>"
```

> ⚠️ **Lưu ý bảo mật:** KHÔNG bao giờ commit file `.env` lên Git. Mã PIN phải được lưu dưới dạng bcrypt hash.

### Bước 4: Khởi tạo Database

```bash
# Đồng bộ schema với database
npx prisma db push

# Seed dữ liệu danh mục (4 categories)
npx prisma db seed
```

### Bước 5: (Tùy chọn) Xem database

```bash
npx prisma studio
```

---

## 🚀 Chạy ứng dụng

```bash
# Development
npm run dev

# Mở trình duyệt
open http://localhost:3000
```

Mã PIN mặc định (demo): `1234`

### Kiểm tra nhanh bằng API

```bash
# Đăng nhập
curl -s -X POST http://localhost:3000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234"}'

# Thêm chi tiêu (thay <SESSION_ID> bằng sessionId từ bước trên)
curl -s -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: <SESSION_ID>" \
  -d '{"amount": 150000, "categoryCode": "LIVING", "expenseDate": "2026-02-26", "note": "Mua rau"}'

# Xem thống kê tháng
curl -s "http://localhost:3000/api/stats/monthly?month=2026-02" \
  -H "X-Session-Id: <SESSION_ID>"
```

---

## 📁 Cấu trúc thư mục

```
ai-in-sdlc-demo/
├── .github/
│   ├── copilot-instructions.md          # 📜 Hiến pháp dự án (Custom Instructions)
│   └── skills/                          # 🧠 Copilot Skills
│       ├── req-analyzer/                #    Phân tích yêu cầu (BA)
│       ├── external-design-generator/   #    Sinh thiết kế cơ bản
│       ├── internal-design-generator/   #    Sinh thiết kế chi tiết
│       ├── multi-agent-coder/           #    Điều phối multi-agent coding
│       ├── unit-testing/                #    (Placeholder) Sinh unit test
│       ├── legacy-refactor/             #    (Placeholder) Refactor code cũ
│       ├── log-rca-analyzer/            #    (Placeholder) Phân tích log/RCA
│       └── mock-data-factory/           #    (Placeholder) Sinh dữ liệu test
│
└── app-project/                         # 💻 Source code ứng dụng
    ├── family-meeting-notes.txt         # 📝 Input gốc: ghi chú họp gia đình
    ├── docs/                            # 📚 Tài liệu (AI sinh ra)
    │   ├── 01-requirements/             #    SRS: Business, Functional, Non-functional
    │   ├── 02-external-design/          #    Thiết kế cơ bản (UC-01~03)
    │   └── 03-internal-design/          #    Thiết kế chi tiết + Feasibility Check
    ├── testing/                         # 🧪 Kiểm thử (AI sinh ra)
    │   ├── integration/                 #    IT: Kịch bản kiểm thử tích hợp
    │   │   └── IT_Test_Cases.md         #    8 kịch bản, 18 test cases
    │   └── unittesting/                 #    UT: Unit test cho từng UC
    │       └── UC-02/                   #    Test scripts + data + evidence
    ├── prisma/
    │   ├── schema.prisma                #    Database schema
    │   ├── seed.ts                      #    Seed 4 danh mục
    │   └── prisma/dev.db                #    SQLite database file
    ├── app/                             #    Next.js App Router
    │   ├── page.tsx                     #    UC-01: Trang đăng nhập PIN
    │   ├── home/page.tsx                #    Trang chủ
    │   ├── expenses/new/page.tsx        #    UC-02: Form thêm chi tiêu
    │   ├── stats/page.tsx               #    UC-03: Biểu đồ thống kê
    │   └── api/                         #    API Routes
    │       ├── auth/verify-pin/         #    POST /api/auth/verify-pin
    │       ├── expenses/                #    POST /api/expenses
    │       └── stats/monthly/           #    GET  /api/stats/monthly
    └── src/
        ├── components/                  #    React Components
        │   ├── PINLogin/                #    UC-01: Bàn phím PIN
        │   ├── ExpenseForm/             #    UC-02: Form chi tiêu
        │   ├── ExpenseChart/            #    UC-03: Biểu đồ cột
        │   ├── MonthPicker/             #    UC-03: Chọn tháng
        │   └── StatsCard/               #    UC-03: Card thống kê
        ├── hooks/                       #    Custom React Hooks
        ├── lib/                         #    Utilities, API clients, validations
        ├── constants/                   #    Hằng số
        └── types/                       #    TypeScript types
```

---

## 🧠 Tìm hiểu Skills & Agents

### Custom Instructions (Hiến pháp dự án)

File `.github/copilot-instructions.md` định nghĩa các **quy tắc bất di bất dịch** mà AI phải tuân theo:

| Quy tắc | Nội dung |
|----------|----------|
| 🌐 Ngôn ngữ | UI/comment bằng Tiếng Việt, biến/hàm bằng Tiếng Anh |
| 📅 Date/Time | BẮT BUỘC dùng `date-fns`, CẤM dùng `moment.js` |
| 🔒 Bảo mật | CẤM hardcode PIN, phải dùng `process.env` hoặc bcrypt hash |
| 🎨 Styling | TailwindCSS utility classes |

### Danh sách Skills

Mỗi skill nằm trong `.github/skills/<tên>/SKILL.md` và có thể kèm `references/` (templates, examples).

| # | Skill | Từ khóa kích hoạt | Mô tả | Trạng thái |
|---|-------|-------------------|-------|:---:|
| 1 | **req-analyzer** | "phân tích yêu cầu", "use case", "user story" | Chuyên gia BA — biến meeting notes thành tài liệu SRS có cấu trúc | ✅ Đã dùng |
| 2 | **external-design-generator** | "thiết kế cơ bản", "external design", "基本設計" | Sinh 4 tài liệu: Kiến trúc, Màn hình, DB Logic, API (chuẩn IPA Nhật Bản) | ✅ Đã dùng |
| 3 | **internal-design-generator** | "thiết kế chi tiết", "internal design", "詳細設計" | Sinh pseudocode, Prisma schema, class design + Feasibility Check đa vai | ✅ Đã dùng |
| 4 | **multi-agent-coder** | "bắt đầu code", "lập trình multi-agent" | Orchestrator điều phối 3 sub-agents: Scaffolding → Coder → QA | ✅ Đã dùng |
| 5 | **unit-testing** | "unit test", "kiểm thử đơn vị" | Sinh test cases + test scripts (Vitest) cho từng UC | ✅ Đã dùng |
| 6 | **integration-test-generator** | "integration test", "kiểm thử tích hợp" | Sinh kịch bản IT xuyên suốt các UC (chuẩn IPA) | ✅ Đã dùng |
| 7 | legacy-refactor | *(placeholder)* | Refactor code legacy | ⬜ |
| 8 | log-rca-analyzer | *(placeholder)* | Phân tích log, tìm root cause | ⬜ |
| 9 | mock-data-factory | *(placeholder)* | Sinh mock data cho testing | ⬜ |

### Cách chạy thử Skills

**Bước 1:** Mở dự án trong VS Code với GitHub Copilot đã kích hoạt.

**Bước 2:** Mở Copilot Chat (Agent mode) và thử các prompt sau:

```
# Skill 1: Phân tích yêu cầu
> Hãy phân tích yêu cầu từ file family-meeting-notes.txt

# Skill 2: Thiết kế cơ bản
> Tạo thiết kế cơ bản cho UC-01

# Skill 3: Thiết kế chi tiết
> Tạo thiết kế chi tiết cho UC-01

# Skill 4: Bắt đầu code
> Bắt đầu code chức năng UC-01

# Skill 5: Unit test
> Tạo unit test cho UC-02

# Skill 6: Integration test
> Tạo integration test cho toàn bộ hệ thống
```

### Multi-Agent Coder — Chi tiết

Skill `multi-agent-coder` là skill phức tạp nhất, hoạt động theo mô hình **Prompt Chaining** với 3 sub-agents:

```
┌──────────────────┐     ┌──────────┐     ┌──────────┐
│ Scaffolding Agent│────▶│  Coder   │────▶│    QA    │
│ (Tạo cấu trúc   │     │  Agent   │     │  Agent   │
│  file/folder)    │     │ (Viết    │     │ (Kiểm   │
│                  │     │  code)   │     │  tra)    │
└──────────────────┘     └──────────┘     └──────────┘
        │                      │                │
        ▼                      ▼                ▼
   skill-1-scaffolding.md  skill-2-coder.md  skill-3-qa.md
```

- **`auto_mode = false`** (mặc định): Dừng hỏi người dùng sau mỗi file → kiểm soát từng bước
- **`auto_mode = true`**: Tự động chạy hết tất cả files không cần hỏi

---

## 📚 Tài liệu dự án

Toàn bộ tài liệu được AI sinh ra từ meeting notes, lưu trong `docs/`:

| Giai đoạn | Thư mục | Nội dung |
|-----------|---------|----------|
| Phân tích yêu cầu | `docs/01-requirements/` | SRS Business, Functional, Non-functional |
| Thiết kế cơ bản | `docs/02-external-design/UC-0x/` | Kiến trúc, Màn hình, DB Logic, API |
| Thiết kế chi tiết | `docs/03-internal-design/UC-0x/` | Program Design, Processing Logic |
| DB vật lý | `docs/03-internal-design/00_Butsuri_DB_Sekkei.md` | Prisma Schema thiết kế |
| Kiểm tra khả thi | `docs/03-internal-design/99_Feasibility_Check_Report.md` | Review đa vai (Dev + Tester) |
| Unit Test | `testing/unittesting/UC-02/` | Test cases, scripts (Vitest), data, evidence |
| Integration Test | `testing/integration/IT_Test_Cases.md` | 8 kịch bản tích hợp, 18 test cases (chuẩn IPA) |

---

## 🛠 Tech Stack

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Styling | TailwindCSS | 4 |
| ORM | Prisma | 5.22.0 |
| Database | SQLite | 3 |
| Validation | Zod | 4.3.6 |
| Date/Time | date-fns | 4.1.0 |
| Charts | Recharts | 3.7.0 |
| Auth | bcrypt | 6.0.0 |
| Testing | Vitest | 4.0.18 |
| Language | TypeScript | 5 |

---

## 🗄 Database Schema

```
┌──────────────────┐     ┌──────────────────┐
│  app_sessions    │     │ login_attempts   │
├──────────────────┤     ├──────────────────┤
│ id (UUID, PK)    │     │ id (INT, PK)     │
│ expires_at       │     │ attempt_time     │
│ created_at       │     │ is_success       │
└──────────────────┘     │ ip_address       │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ mst_categories   │◄────│  trn_expenses    │
├──────────────────┤     ├──────────────────┤
│ code (PK)        │     │ id (UUID, PK)    │
│ name             │     │ amount (INT)     │
│ icon             │     │ category_code FK │
│ color            │     │ expense_date     │
│ sort_order       │     │ note             │
│ is_active        │     │ is_deleted       │
│ created_at       │     │ created_at       │
│ updated_at       │     │ updated_at       │
└──────────────────┘     └──────────────────┘
```

Database đã được seed sẵn với 4 danh mục và dữ liệu demo. File `prisma/prisma/dev.db` được commit lên repo để tiện chạy thử ngay.

---

## 📄 License

MIT © 2026 — Dự án demo cho mục đích học tập và trình bày.
