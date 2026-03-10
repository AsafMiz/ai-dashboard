# COMMUNi Dashboard — Design Style Guidelines

## Design Philosophy

Clean, data-dense, fintech-inspired aesthetic. White cards on a neutral background, minimal color usage, and generous whitespace let the data speak. Hebrew RTL by default. Every widget is API-configurable — accent colors flow from the data, not the code.

---

## Color System

### API-Driven Accent Color

Components **do not hardcode** their accent color. Each widget receives its color from the API via `config.color`. This makes dashboards fully customizable per-widget.

| Pattern | Usage | Example |
|---|---|---|
| `style={{ color }}` | Text in accent color | Score values, trend numbers |
| `style={{ backgroundColor: color }}` | Solid accent fills | Badges, progress bars, chart fills |
| `style={{ backgroundColor: \`${color}15\` }}` | 15% opacity tint | Badge backgrounds, subtle highlights |

**Default accent:** `#10b981` (Emerald 500) — used when `config.color` is not provided.

### Semantic Colors

| Color | Tailwind | Hex | Usage |
|---|---|---|---|
| Blue 600 | `blue-600` | `#2563eb` | Links, CTAs, interactive elements, secondary chart color |
| Green 500 | `green-500` / `green-600` | `#10b981` | Success, upward trends |
| Red 400/500 | `red-400` / `red-500` | `#f87171` / `#ef4444` | Decline, downward trends, candlestick bearish |
| Amber 500 | `amber-500` | `#f59e0b` | Warnings, PUT method badge |

### Grayscale

| Token | Light | Dark |
|---|---|---|
| Page background | `bg-gray-50` | `dark:bg-gray-950` |
| Card background | `bg-white` | `dark:bg-gray-900` |
| Primary text | `text-gray-900` | `dark:text-white` |
| Secondary text | `text-gray-700` | `dark:text-gray-300` |
| Muted text | `text-gray-500` | `dark:text-gray-400` |
| Faint text | `text-gray-400` | `dark:text-gray-500`/`dark:text-gray-600` |
| Primary border | `border-gray-200` | `dark:border-gray-800` |
| Subtle border | `border-gray-100` | `dark:border-gray-800/50` |

---

## Typography

**Font:** System sans-serif stack — `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

No custom fonts. Set via CSS variable `--font-sans` in `globals.css`.

### Scale

| Element | Classes | Example |
|---|---|---|
| Page title | `text-xl sm:text-2xl font-bold` | Dashboard name |
| Widget title | `text-sm sm:text-base font-semibold` | "מפת מימדי לכידות" |
| Body text | `text-sm text-gray-700 dark:text-gray-300` | Descriptions |
| Secondary text | `text-xs text-gray-500 dark:text-gray-400` | Subtitles, dates |
| Micro text | `text-[11px] text-gray-400` | Chart labels, metadata |
| Large number | `text-6xl font-bold` | Scorecard main value (76%) |
| Medium number | `text-xl font-bold` | Donut ring percentage overlay |
| Code/mono | `text-[11px] font-mono` | URLs, keys, API paths |

### Weight Conventions

- `font-bold` (700): numbers, headings, badges
- `font-semibold` (600): widget titles, navigation
- `font-medium` (500): labels, interactive elements
- Default (400): body text

---

## Layout

### Grid System

- **Mobile** (default): 1 column
- **Desktop** (`lg:`): 2 columns — `grid grid-cols-1 lg:grid-cols-2`
- **Gap:** `gap-4 sm:gap-5`

**Full-width widgets** (span both columns on desktop): `table`, `candlestick`, `recommendations`, `feed`, `title`

### Spacing Scale

| Context | Mobile | Desktop |
|---|---|---|
| Page padding | `p-4` | `sm:p-6` |
| Card padding | `p-3` | `sm:p-4` |
| Card header | `px-4 py-3` | `sm:px-5 py-3` |
| Section gap | `space-y-3` | `space-y-4` |
| Inline gap | `gap-2` — `gap-4` | `gap-3` — `gap-6` |

### Responsive Breakpoints

- Mobile first (no prefix)
- `sm:` — 640px
- `lg:` — 1024px

---

## Components

### Cards

The primary container for widgets and content blocks.

```
bg-white dark:bg-gray-900
rounded-xl
border border-gray-200 dark:border-gray-800
shadow-sm
overflow-hidden
```

**Title widgets** render without card styling (no border, no background).

### Badges / Pills

Used for type labels, status indicators, and trend values.

```
px-2 py-0.5  (or px-3 py-1 for larger)
rounded-full
text-xs font-semibold (or text-[11px])
```

**Tint pattern** for soft backgrounds:
```jsx
style={{
  backgroundColor: `${color}15`,  // 15% opacity of accent
  color: color,                    // solid accent text
}}
```

### Buttons

| Type | Classes |
|---|---|
| Primary CTA | `bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2` |
| Secondary | `border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 rounded-lg` |
| Icon button | `p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800` |
| Toggle | `p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800` |

**Disabled:** `disabled:opacity-50`

### Progress Bars

```
Track: h-2 rounded-full bg-gray-100 dark:bg-gray-800
Fill:  h-2 rounded-full transition-all  (backgroundColor via inline style)
```

### Icons (Lucide)

| Size | Classes | Usage |
|---|---|---|
| Small | `w-3 h-3` / `w-3.5 h-3.5` | Inline with text, metadata |
| Default | `w-4 h-4` | Navigation, labels |
| Medium | `w-5 h-5` | Card actions |
| Large | `w-8 h-8` | Dashboard icon |

Color: `text-gray-400` (default), `text-blue-600` (active), or accent via API.

**Dynamic icons:** Loaded by string name via `LucideIcons[name]` pattern.

---

## Charts (Recharts)

### General Conventions

- **Height:** 300px standard, 320px for radar
- **Container:** `<ResponsiveContainer width="100%" height={300}>`
- **Bar radius:** `radius={[4, 4, 0, 0]}` (rounded top corners)
- **Animation:** `animationDuration={800}` for entrance animations
- **Grid:** `strokeDasharray="3 3"` for dashed grid lines

### Color Usage in Charts

Colors come from `config.color` (and `config.colors` for multi-series):

```jsx
<Bar fill={color} />                    // Solid fill from API
<Area stroke={color} fill={color} fillOpacity={0.15} />
<Radar stroke={color} fill={color} fillOpacity={0.3} />
```

Multi-series charts (donut, stacked-bar) use `config.colors` array.

### Tooltip Styling

```jsx
contentStyle={{
  backgroundColor: 'rgba(17, 24, 39, 0.9)',   // gray-900 at 90%
  color: '#f9fafb',                             // gray-50
  borderRadius: 8,
  border: 'none',
  fontSize: 12,
}}
```

Custom tooltips use card-style:
```
bg-white dark:bg-gray-900
border border-gray-200 dark:border-gray-700
rounded-lg px-3 py-2 shadow-lg
```

### Axis Labels

```jsx
tick={{ fontSize: 11, fill: '#9ca3af' }}    // gray-400
```

### Donut / Ring Chart

Compact ring + side text layout used for ratio/percentage data.

**Ring Dimensions**
```jsx
<div className="relative w-[100px] h-[100px] shrink-0">
  <Pie
    innerRadius="75%"       // thin ring
    outerRadius="95%"
    cornerRadius={10}       // rounded ends
    startAngle={90}         // clockwise from top
    endAngle={-270}
    stroke="none"
    animationDuration={800}
  />
</div>
```

**Center Overlay** — percentage inside the ring:
```jsx
<div className="absolute inset-0 flex items-center justify-center">
  <span className="text-xl font-bold" style={{ color: colors[0] }}>
    {percent}%
  </span>
</div>
```

**Side Text** (beside ring):

| Element | Classes |
|---|---|
| Label | `text-sm font-medium text-gray-600 dark:text-gray-400` |
| Primary value | `text-3xl font-bold text-gray-900 dark:text-white` |
| Denominator (/total) | `text-lg text-gray-400 dark:text-gray-500` |
| Sub-label | `text-xs text-gray-400 dark:text-gray-500` |

Number row uses `dir="ltr"` with `items-baseline gap-0.5` for correct digit ordering.

**RTL Layout:**
```
flex items-center justify-center gap-6 py-4
```
HTML order: text first, ring second → RTL flex renders ring on left, text on right.

**Colors:** `config.colors` array (default `['#10b981', '#e5e7eb']`). First color = primary segment + percentage overlay; second = remainder track.

---

## Dark Mode

Toggled manually via `next-themes` with `attribute="class"`. No system preference detection.

### Implementation

- `<html>` receives `.dark` class
- Tailwind `dark:` variant: `@custom-variant dark (&:where(.dark, .dark *))`
- Smooth transition: `* { transition: background-color 0.2s ease, border-color 0.2s ease; }`

### Color Mapping

| Light | Dark |
|---|---|
| `bg-white` | `dark:bg-gray-900` or `dark:bg-gray-950` |
| `bg-gray-50` | `dark:bg-gray-900` |
| `text-gray-900` | `dark:text-white` |
| `text-gray-700` | `dark:text-gray-300` |
| `text-gray-500` | `dark:text-gray-400` |
| `border-gray-200` | `dark:border-gray-800` |
| `hover:bg-gray-100` | `dark:hover:bg-gray-800` |
| `bg-blue-50` | `dark:bg-blue-950` |

### Scrollbar

```css
::-webkit-scrollbar-thumb { background: #d1d5db; }     /* light */
.dark ::-webkit-scrollbar-thumb { background: #374151; } /* dark */
```

---

## RTL & Localization

- **Global:** `<html lang="he" dir="rtl">`
- **All user-facing text:** Hebrew
- **Date formatting:** `toLocaleDateString('he-IL')`
- **LTR exceptions:** URL inputs, code blocks, API paths — use `dir="ltr"`
- **Charts/tables:** Tailwind classes handle RTL naturally; use `text-left` only inside LTR code blocks

---

## Key Principle: API-Driven Styling

Every widget component accepts `{ data: DataRow[], config: WidgetConfig }`. The `config.color` field (hex string) drives the visual identity of each widget. This means:

- A single dashboard can have widgets in different brand colors
- Color is **data**, not code — changing it requires an API call, not a deploy
- Components use the color via inline styles (`style={{ color }}`) rather than Tailwind color classes
- Default fallback: `const color = config.color ?? '#10b981'`

This pattern is consistent across all 12 widget types.
