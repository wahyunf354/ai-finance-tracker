# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build (uses --webpack flag)
npm run lint         # ESLint
npm test             # Jest (all tests)
npm test -- --testPathPattern=<file>  # Single test file
npm run test:watch   # Jest watch mode
```

## Architecture

### Auth & Session

Auth is NextAuth v5 (Google OAuth only) configured in `auth.ts`. The exported `auth` middleware in `middleware.ts` protects all routes except `/api`, `/login`, `/about`, and static assets. On sign-in, the user is upserted into Supabase `public.users`.

### Data Layer

All Supabase calls use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Row isolation is enforced manually — every API route filters by `user_email = session.user.email`. Never trust a client-provided email for data access.

`lib/supabase.ts` exports a singleton using `SUPABASE_ANON_KEY` for client-side use, but API routes create their own client inline with the service role key.

### AI Pipeline (`app/api/chat/route.ts`)

The core feature. Accepts `multipart/form-data` with either:
- `text` field (text input)
- `file` field (image → receipt OCR, audio → transcription)

Flow:
1. Authenticates session and determines `source` (`text` | `image` | `audio`)
2. Checks daily usage limits from `app_configs` table (`free_image_limit`, `free_voice_limit` keys); premium users bypass limits
3. Fetches user's budgets to inject as prioritized categories into the Gemini prompt
4. Sends to `gemini-flash-latest` with a strict JSON response schema
5. Inserts parsed transaction directly into Supabase with `source` field set

The `app/api/process-voice/route.ts` is a legacy mock endpoint — it returns hardcoded data and is not used in production.

### Budget AI (`app/api/budgets/suggest/route.ts`)

Sends the last 90 days of expense history to `gemini-flash-latest` and returns suggested monthly budget amounts per category (+10% above average, rounded to nearest 50,000 IDR).

### Frontend Structure

Each feature route has colocated `_components/` and `_hooks/` directories:
- `app/dashboard/_hooks/useDashboardData.ts` — fetches all transactions for a date range (up to limit 10000), computes stats/charts client-side
- `app/transactions/_hooks/useTransactions.ts` — paginated fetch with debounced search, filter, sort; handles edit/delete/export

Shared UI primitives are in `components/ui/` (shadcn/ui). `components/` holds layout-level components (navbar, header, voice recorder).

### i18n

`context/LanguageContext.tsx` uses `useSyncExternalStore` to sync language preference from `localStorage` with a custom `language-change` event. Call `useLanguage()` to get `{ t, language, setLanguage }`. Translations live in `translations/en.json` and `translations/id.json`. Default language is Indonesian (`id`).

### Database

SQL migrations are in `sql/` and applied manually to Supabase. `supabase_schema.sql` is the base schema. Key tables:
- `transactions` — `user_email`, `date`, `description`, `amount`, `category`, `type` (`income`|`expense`), `source`, `items` (JSONB), `tax`, `discount`
- `users` — `email`, `name`, `image`, `is_premium`, `billing_cycle_start_day`, `last_login`
- `budgets` — `user_email`, `category`, `amount`; unique on `(user_email, category)`
- `app_configs` — key/value table for feature flags and limits (`free_image_limit`, `free_voice_limit`)

### Export

PDF export is premium-only via `lib/export-pdf.ts` (jsPDF + jspdf-autotable). Excel export uses ExcelJS and runs entirely client-side in `useTransactions`.

### PWA

Configured via `@ducanh2912/next-pwa`. Service worker and workbox assets are in `public/`. The manifest is defined in `app/manifest.ts`.

## Required Env Vars

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
AUTH_SECRET
GEMINI_API_KEY
```
