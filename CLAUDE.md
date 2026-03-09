# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build — use this to verify changes (no test framework)
npm run lint     # ESLint
```

## Architecture

COMMUNi Dashboard is a generic data-driven dashboard platform. Dashboards are identified by a URL key (e.g. `/dashboard/example`) and contain reports, each with widgets that visualize data from datasets.

**Data flow:** Dashboards → Reports → Widgets → Datasets (JSONB)

### Server vs Client Component Boundary

- **Pages** (`app/dashboard/[key]/page.tsx`, `app/dashboard/[key]/[reportKey]/page.tsx`) are **server components** that fetch from Supabase with `revalidate = 0` (always fresh)
- **Widgets** (`components/charts/*`) are **client components** (`'use client'`) — they receive `data: DataRow[]` and `config: WidgetConfig` (both from `lib/types.ts`)
- **WidgetRenderer** (`components/WidgetRenderer.tsx`) bridges the gap: fetches dataset rows from Supabase, subscribes to Realtime changes via `supabase.channel()`, and renders the appropriate chart component via a switch statement

### Widget System

12 types: `area`, `bar`, `candlestick`, `table`, `radar`, `scorecard`, `donut`, `stacked-bar`, `recommendations`, `highlight`, `feed`, `title`

To add a new widget type:
1. Create `src/components/charts/{Name}Widget.tsx` — must accept `{ data: DataRow[], config: WidgetConfig }`
2. Add type to `WidgetType` union and any config keys to `WidgetConfig` in `src/lib/types.ts`
3. Add `case` in `src/components/WidgetRenderer.tsx`
4. Add preview to `src/app/api-docs/page.tsx` and update `docs/guide.md`

### Layout System (DashboardGrid)

- 1 column on mobile, 2 columns on `lg+`
- Full-width types (span both columns): `table`, `candlestick`, `recommendations`, `feed`, `title`
- `title` widgets render without card wrapper styling

### Supabase Integration

- **Project ID:** `juwweyukfszpisowuizd`
- **Tables:** `dashboards`, `reports`, `widgets`, `datasets`
- **Client** (`lib/supabase.ts`): uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (read-only)
- **API routes**: use `SUPABASE_SERVICE_ROLE_KEY` with fallback to anon key
- **Realtime**: enabled on `datasets` table — WidgetRenderer auto-refetches on changes
- **Migrations**: use Supabase MCP tool `apply_migration`

### API Routes

- `POST /api/dashboards` — Creates dashboard (metadata only, no datasets). Returns 409 if key exists.
- `GET /api/dashboards/[key]` — Returns dashboard metadata + reports list with URLs.
- `DELETE /api/dashboards/[key]` — Deletes dashboard (FK cascade handles reports, widgets, datasets).
- `POST /api/reports` — Creates report with inline widget data. Validates dashboard exists (404), report doesn't exist (409). Auto-generates datasets.
- `DELETE /api/reports/[dashboardKey]/[reportKey]` — Deletes report + its widgets + datasets.

All accept `logo_url` (optional). Full schemas in `docs/guide.md`.

### Example Data Flow

Home page "create example" button: DELETEs `/api/dashboards/example` (ignore errors) → POSTs `/api/dashboards` (metadata only) → fetches each report from `public/data/example/reports/*.json` → POSTs each to `/api/reports` (with inline data per widget) → navigates to `/dashboard/example`.

## Key Conventions

- **Hebrew RTL**: `<html lang="he" dir="rtl">` — all user-facing text in Hebrew. Use `dir="ltr"` on URL/key input fields.
- **Dark mode**: `next-themes` with `attribute="class"`, manual toggle only (not system preference). `LogoImage` component (`components/layout/LogoImage.tsx`) handles image fallback to `/communi-logo.webp`.
- **Date formatting**: `toLocaleDateString('he-IL')`
- **Dynamic icons**: Lucide icons loaded by name string via `LucideIcons[name]`
- **Inline widget data**: When creating reports via API, each widget carries its own `data` array. The API auto-generates datasets and sets `config.datasetKey`. WidgetRenderer reads from the `datasets` table at render time.

## Git Workflow

- Commit messages: imperative tense ("Add feature", "Fix bug")
- Feature branches: kebab-case, merge to main with `--no-ff`
