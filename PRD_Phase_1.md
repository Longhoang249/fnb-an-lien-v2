# PRD: Phase 1 - Foundation & Infrastructure (FnBanLien V2)

## 1. Tổng quan & Mục tiêu (Objective)
**Mục tiêu:** Xây dựng bộ khung nền tảng vững chắc (Boilerplate) cho dự án FnBanLien V2, kế thừa toàn bộ các tiêu chuẩn kỹ thuật (Tech stack, Design System, cấu trúc thư mục) từ giải pháp V1 - `dong-goi-thuong-hieu`. 
**Người/Agent triển khai:** Claude Code.
**Kết quả mong đợi:** Ứng dụng chạy mượt mà, không lỗi lint/TS, đã tích hợp thành công TailwindCSS, React Router, Supabase Client và có sẵn cấu trúc thư mục chuẩn bị cho Phase 2.

## 2. Tech Stack Setup & Configurations
Cần cài đặt và cấu hình hoàn chỉnh các thư viện sau trên nền Vite + React 19:
- **Styling:** `tailwindcss` (phiên bản ổn định mới nhất, tự động map các biến CSS token của V1).
- **Routing:** `react-router-dom` (thiết lập bộ định tuyến cơ sở ở `App.tsx`).
- **Backend/DB Clients:** `@supabase/supabase-js`.
- **Icons & UI Helpers:** `lucide-react`, `clsx`, `tailwind-merge` (để hỗ trợ gộp class cho các UI components cơ bản).
- **State Management / Data Fetching:** Chuẩn bị sẵn (Dùng Zustand hoặc React Context API, có thể cài đặt sau nếu cần ở cấp cao hơn, hiện tại ưu tiên Context).

## 3. Cấu trúc thư mục cốt lõi (Folder Structure Scaffolding)
Đảm bảo project có cấu trúc tường minh theo V1:
```text
fnb-an-lien-v2/
├── src/
│   ├── assets/            # Static files, hình ảnh, SVG
│   ├── components/
│   │   ├── ui/            # Reusable core components (Buttons, Inputs, Modals, Toasts)
│   │   ├── layout/        # Header, Sidebar, Wrapper
│   │   └── shared/        # Các componets dùng chung qua nhiều màn hình
│   ├── lib/
│   │   ├── supabase/      # client.ts (chứa logic init Supabase), và TS database types
│   │   └── utils.ts       # Utility functions (cn function gộp class giống shadcn)
│   ├── screens/           # Các màn hình chính (Home, Login, Dashboard...)
│   ├── hooks/             # Custom React Hooks
│   ├── styles/            # index.css (Global styles + CSS Variables)
│   ├── App.tsx            # Root component chứa Router provider
│   └── main.tsx           # Entry point
├── supabase/              # Nơi chứa config Supabase Edge Functions sau này
├── .env                   # Khởi tạo file biến môi trường (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
└── package.json           # Scripts, dependencies
```

## 4. Yêu cầu triển khai chi tiết cho Claude Code

### Task 1: Setup Tailwind & Architecture CSS Variables
- Khởi tạo cấu hình Tailwind CSS chuẩn.
- Bổ sung vào `src/index.css` (hoặc `styles/index.css`) cơ chế CSS Variables. Kế thừa các màu sắc "tinh hoa" của V1:
  - Tone màu Brand: **Vàng ngọc (Gold) / Đen nhám (Dark mode)** hoặc hệ màu phù hợp từ V1.
  - Các typography base (Inter/Outfit).

### Task 2: Setup Core Utils & UI Components
- Tạo `src/lib/utils.ts` với hàm `cn` sử dụng `clsx` và `tailwind-merge` (cấu trúc chuẩn như shadcn).
- Khởi tạo ít nhất 3 components base trong `src/components/ui/`:
  - `Button.tsx`: Chứa các variants cơ bản (primary, secondary, outline, ghost).
  - `Input.tsx`: Base input component.
  - `Card.tsx`: Base card component để re-use nội dung.

### Task 3: Cấu hình Supabase Client
- Tạo `src/lib/supabase/client.ts`.
- Viết logic khởi tạo Supabase Client sử dụng `createClient` lấy creds từ `import.meta.env`.
- Đảm bảo có xử lý lỗi khi thiếu URL hoặc Key trong `.env`.

### Task 4: Base Routing
- Set up `react-router-dom` tại `App.tsx`.
- Tạo 2 màn hình giả lập cơ bản:
  - `src/screens/Home.tsx` (Màn hình chính/Landing tạm thời).
  - `src/screens/NotFound.tsx` (404 Page).

## 5. Acceptance Criteria (Tiêu chí nghiệm thu cho Claude Code)
1. **Lệnh build và dev:** Gõ `npm run dev` không xuất hiện bất kỳ lỗi console/terminal nào. Cảnh báo ESLint/TypeScript bằng 0.
2. **Tailwind Hoạt động:** Sử dụng thử component `Button` với các màu sắc chuẩn. UI hiển thị chính xác các class tiện ích của Tailwind.
3. **Routing hoạt động:** Khi gõ `/` ra trang Home. Gõ `/random-url` ra màn hình 404.
4. **Supabase Ready:** Module `client.ts` sẵn sàng import vào bất cứ đâu mà không báo lỗi Type.
