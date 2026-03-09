# COMMUNi Dashboard

Generic data-driven dashboard platform. Hebrew RTL interface, dark mode, real-time Supabase data.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, Lucide React (icons)
- Recharts 3.7 (area, bar, radar, donut, stacked-bar) + lightweight-charts 5 (candlestick)
- Supabase (PostgreSQL + Realtime)
- Deployment: Vercel (frontend), Supabase (database)

## Supabase

- Project ID: `juwweyukfszpisowuizd`
- Tables: `dashboards`, `reports`, `widgets`, `datasets`
- Realtime enabled on `datasets` table
- RLS enabled, currently public (no auth checks)
- Use Supabase MCP tools for migrations (`apply_migration`)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (use to verify changes)
npm run lint     # ESLint
```

## Key Conventions

- **Hebrew RTL**: `<html lang="he" dir="rtl">` — all user-facing text in Hebrew
- **Server components** for pages (async data fetching from Supabase)
- **Client components** (`'use client'`) for interactive widgets and anything using browser APIs (onError, useState, etc.)
- **LogoImage**: Reusable client component at `src/components/layout/LogoImage.tsx` — handles image fallback to `/communi-logo.webp`
- **Generic JSONB data model**: Datasets store flexible `columns` and `rows` as JSONB — widgets configure which fields to use via `config`
- **No test framework**: Verify changes with `npx next build`

## Git Workflow

- Commit messages: imperative tense ("Add feature", "Fix bug", "Refactor X")
- Feature branches: kebab-case (e.g. `add-logo-support`)
- Merge to main with `--no-ff`
- Co-author line: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## File Structure

```
src/
├── app/
│   ├── api/create-dashboard/route.ts   # POST: create dashboard + seed datasets
│   ├── api/create-report/route.ts      # POST: create report + widgets
│   ├── dashboard/[key]/page.tsx        # Dashboard overview (lists reports)
│   ├── dashboard/[key]/[reportKey]/page.tsx  # Report view (renders widgets)
│   ├── api-docs/page.tsx               # Interactive API docs + widget gallery
│   ├── not-found.tsx                   # Fun animated 404 page
│   ├── layout.tsx                      # Root layout (RTL, dark mode)
│   └── page.tsx                        # Home page
├── components/
│   ├── charts/                         # Widget components (12 types)
│   ├── layout/                         # Header, ThemeToggle, LogoImage, ThemeProvider
│   ├── DashboardGrid.tsx               # Responsive widget grid
│   └── WidgetRenderer.tsx              # Widget switch + Supabase realtime subscription
├── lib/
│   ├── types.ts                        # TypeScript interfaces (Dashboard, Report, Widget, Dataset, WidgetConfig)
│   └── supabase.ts                     # Supabase client init
public/data/example/
├── dashboard.json                      # Example dashboard + datasets
└── reports/*.json                      # Example report definitions (7 files)
docs/
└── guide.md                            # Full technical guide
```

## Widget System

12 widget types: `area`, `bar`, `candlestick`, `table`, `radar`, `scorecard`, `donut`, `stacked-bar`, `recommendations`, `highlight`, `feed`, `title`

Every widget component accepts `(data: DataRow[], config: WidgetConfig)` — defined in `src/lib/types.ts`.

### Adding a New Widget Type

1. Create `src/components/charts/{Name}Widget.tsx` with standard `(data: DataRow[], config: WidgetConfig)` signature
2. Add the type to `WidgetType` union in `src/lib/types.ts`
3. Add any new config keys to `WidgetConfig` interface in `src/lib/types.ts`
4. Add a `case` to the switch in `src/components/WidgetRenderer.tsx`
5. Add preview + sample data to `src/app/api-docs/page.tsx`
6. Update `docs/guide.md` widget config reference table

## API Endpoints

- `POST /api/create-dashboard` — Create/recreate dashboard + seed datasets
- `POST /api/create-report` — Create report + widgets under a dashboard

Both accept `logo_url` (optional). See `docs/guide.md` for full request/response schemas.
