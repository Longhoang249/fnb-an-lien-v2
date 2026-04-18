# FnB Ăn Liền V2

> Marketing AI Assistant for Vietnamese FnB (Food & Beverage) Business Owners

## Overview

**FnB Ăn Liền V2** is a React 19 + TypeScript SaaS application that helps small Vietnamese restaurant and cafe owners create professional marketing content using AI — without needing a design background or agency.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 (CSS variables) |
| Routing | React Router v6 |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| State | Zustand + React Context |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/fnb-an-lien-v2.git
cd fnb-an-lien-v2

# Install dependencies
npm install

# Copy environment variables
cp .env .env.local
# Then fill in your Supabase credentials (see .env file)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file (or `.env.local` for local overrides):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project dashboard → Settings → API.

## Features

- **Auth** — Email/password sign-in and sign-up via Supabase Auth
- **Brand DNA Onboarding** — 5-step wizard to capture shop identity, USP, and archetype
- **Visual DNA Editor** — 4-tab visual configuration (colors, fonts, layout, content tone) with live preview
- **Dashboard** — Gamified XP/Gold/Level system with leaderboard and achievements
- **AI Chat** — Conversational AI assistant (Matcha AI) with gold-based economy
- **Infinite Memory Board** — Drag-and-drop canvas for team notes and campaign ideas
- **Demo Mode** — Works out-of-the-box without logging in (Cà Phê Muối SG demo shop)

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Input, Card
│   ├── layout/      # BaseLayout, ProtectedRoute
│   ├── shared/     # Leaderboard, PremiumLock
│   └── chat/       # ChatBubble
├── lib/
│   ├── supabase/   # client.ts, auth.ts
│   ├── store/      # gamificationStore.ts
│   └── aiAdapter.ts
├── screens/
│   ├── Auth/
│   ├── BrandOnboarding/
│   ├── VisualFormEditor/
│   ├── Dashboard.tsx
│   ├── AIChat.tsx
│   └── InfiniteMemoryBoard.tsx
└── supabase/
    └── functions/  # Edge Functions (Deno)
```

## Database

Run the Supabase migrations in `supabase/migrations/` to set up the required tables:
- `profiles` — XP, gold, level, achievements per user
- `shop_profiles` — Brand DNA data per shop
- `visual_dna_configs` — Visual identity configuration

## Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Deploy to Vercel — the `vercel.json` config is already set up.

## License

Private — © 2026 FnB Ăn Liền
