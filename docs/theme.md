# HealHub Theme & Colour Palette

Authoritative reference for every colour used across the HealHub monorepo.

- Tailwind v4 (configless, `@tailwindcss/postcss`) — utilities are generated
  from CSS custom properties, so **the tokens are the source of truth**.
- Design tokens live in `packages/ui/src/theme.css` (shared by web, admin,
  hospital) with a mobile-app layer in `packages/ui/src/mobile.css`.
- Apps import them via `@import "@healhub/ui/theme.css"` (and `mobile.css`)
  in each app's `globals.css`.
- Font: `--font-outfit` (Outfit via `next/font`), set as `--font-sans`.

A cross-check against the compiled CSS (`apps/web/.next/static/css/*.css`)
verified which utility classes actually resolve — see *Known issues*.

---

## 0. Theme name

**Recommended: `Lagoon`** — the palette reads exactly like a shallow tropical
lagoon: teal water (`#20c3ae` / `#179e8d`), sunlit mint shallows (logo gradient
`#3dd688` → `#05706d`), sand-and-foam surfaces (`#f6f8fa` / `#f3f4f6` /
`#ffffff`), and a living-reef coral accent (`#ff6b6b`, peach `#f7dece`) against
the cool coastal blue-greys (`#e2e5ed` / `#577cff`).

All candidate names tied to the actual colours in the palette:

| Name | Colour inspiration | Notes |
| --- | --- | --- |
| **Lagoon** ⭐ | teal `#20c3ae` + mint gradient + coral `#ff6b6b` | Recommended; covers brand water, sand surfaces, reef accents |
| **Seaglass** | teal-mint `#20c3ae`/`#3dd688` washed into white | Frosted, translucent mint-teal — like beach seaglass |
| **Wellspring** | spring-green logo mesh `#3dd688` | Health/wellness + literal "clear spring water" |
| **Seafoam** | mint `#a6e9e1` + white `#ffffff` surfaces | Bright, hairline-foam feel |
| **Tidal Mint** | mint `#a6e9e1` on cool grey `#f6f8fa` | Mint waves over a tide-of-grey canvas |
| **Mint Lagoon** | mint `#a6e9e1` + teal `#20c3ae` | Softens the brand teal with mint |
| **Coastal Lagoon** | teal + blue-grey accents `#e2e5ed`/`#afc1dc` | Emphasises the shoreline greys |
| **Turquoise Bay** | `#20c3ae` → `#179e8d` range | Plainly reads the turquoise brand family |
| **Emerald Coast** | emerald `#10b981` + teal + sand greys | Health-money greens melted into the coast |
| **Aquamarine** | rich `#20c3ae`-`#05706d` depth | Denser, deeper water tone |
| **Ocean Foam** | white cards + `#edeff2` hairline borders | Clean surfaces with foam edges |
| **Teal Breeze** | teal + `#f6f8fa` airy canvas | Light, airy, soft-medical |
| **Glacier Mint** | mint-whites `#f6f8fa`/`#ffffff` + teal | Ice-fresh mint, hospital-clean |
| **Clearwater** | transparency-felt surfaces, `#f6f8fa` base | Minimal, clinical, cool |
| **Peppermint Sea** | mint `#a6e9e1` + deep teal `#134e4a` | Mint top with deep teal depth |
| **Glass Reef** | frosted whites + coral `#ff6b6b` accents | Reef (coral) meeting frost (glass) |
| **Arctic Mint** | cool whites + light teal | Sub-zero-clean variation of Mint |
| **Seaglass Lagoon** | seaglass + brand teal | Long-form, strongest "beach" read |

> If naming the whole product, prefer **Lagoon** (short, matches logo + accent
> corals). Use **Seaglass** if you want a quieter, more clinical tone. Pick one
> and refactor it into the doc + README so it stays the single source.

---

## 1. Brand layer — `packages/ui/src/theme.css`

Two representations of every value:

- **Raw CSS var** in `:root` (e.g. `--primary: #20c3ae`).
- **`@theme inline` token** (e.g. `--color-primary`) that turns into Tailwind
  utilities by kebab-cased suffix: `--color-primary` → `text-primary`,
  `bg-primary`, `border-primary`.

### 1.1 Primary / brand

| CSS var | `--color-*` token | Value | Resolves as | Meaning |
| --- | --- | --- | --- | --- |
| `--primary` | `--color-primary` | `#20c3ae` | `text/bg/border/from-primary` | Brand teal — buttons, links, active nav, primary CTA |
| `--primary-hover` | `--color-primary-hover` | `#179e8d` | `bg-primary-hover` | Brand teal, hover/darker state |
| `--primary-soft` | `--color-primary-soft` | `#a6e9e1` | `bg/border/text-primary-soft` | Soft teal tint — pills, chips, backgrounds |
| `--primary-soft-dark` | `--color-primary-soft-dark` | `#134e4a` | `text-primary-soft-dark` | Deep teal — text on brand tints |

### 1.2 Backgrounds

| CSS var | `--color-*` token | Value | Resolves as |
| --- | --- | --- | --- |
| `--bg-light` | `--color-background-light` | `#f3f4f6` | `bg-background-light` |
| `--bg-dark` | `--color-background-dark` | `#0f172a` | `bg-background-dark` |
| `--bg-card-light` | `--color-background-card-light` | `#ffffff` | `bg-background-card-light` |
| `--bg-card-dark` | `--color-background-card-dark` | `#111827` | `bg-background-card-dark` |

### 1.3 Text

| CSS var | `--color-*` token | Value | Resolves as |
| --- | --- | --- | --- |
| `--text-primary-light` | `--color-text-primary-light` | `#1f2933` | `text-text-primary-light` |
| `--text-primary-dark` | `--color-text-primary-dark` | `#ffffff` | `text-text-primary-dark` |
| `--text-secondary-light` | `--color-text-secondary-light` | `#6b7280` | `text-text-secondary-light` |
| `--text-secondary-dark` | `--color-text-secondary-dark` | `#9ca3af` | `text-text-secondary-dark` |

### 1.4 Accents

| CSS var | `--color-*` token | Value | Resolves as | Meaning |
| --- | --- | --- | --- | --- |
| `--accent-cta` | `--color-accent-cta` | `#ff6b6b` | `text/bg-accent-cta` | Coral/red — destructive or loud CTA |
| `--accent-warning` | `--color-accent-warning` | `#f4d35e` | `text/bg-accent-warning` | Yellow — warnings / ratings |
| `--accent-link-light` | `--color-accent-link-light` | `#3a4f7a` | `text-accent-link-light` | Navy — links, light mode |
| `--accent-link-dark` | `--color-accent-link-dark` | `#a6b4e0` | `text-accent-link-dark` | Periwinkle — links, dark mode |

### 1.5 Borders

| CSS var | `--color-*` token | Value | Resolves as |
| --- | --- | --- | --- |
| `--border-light` | `--color-border-light` | `#e5e7eb` | `border-border-light` |
| `--border-dark` | `--color-border-dark` | `#374151` | `border-border-dark` |

`color-scheme: light` is active — only the `-light` variants render today.

### 1.6 How the tokens map to utilities

Tailwind v4 builds the utility name from the token suffix:

```
--color-primary            -> text-primary / bg-primary / border-primary
--color-primary-soft-dark  -> text-primary-soft-dark
--color-background-card-light -> bg-background-card-light
--color-text-secondary-light  -> text-text-secondary-light
```

Same colour can target any property: `text-*` (color), `bg-*` (background),
`border-*` (border-color), `from/to/via-*` (gradients), `ring-*`, `outline-*`,
`fill-*`, `shadow-*`.

---

## 2. Mobile-app layer — `packages/ui/src/mobile.css`

Design utilities for the app-like mobile experience (and desktop app shell).

| Token / element | Value | Used for |
| --- | --- | --- |
| `--color-app-bg` | `#f6f8fa` | App canvas background (desktop + mobile) |
| `--color-app-surface` | `#ffffff` | Cards, sheets, app surfaces |
| `--color-app-muted` | `#8a94a3` | Muted/label text, placeholder icons |
| `--radius-app` | `1.15rem` | App card, bar, bill rounding |
| `.app-screen` bg | `#f6f8fa` | Full-bleed app page background |
| `.mobile-app-bar` | `rgba(255,255,255,0.9)` + `blur(14px)` | Sticky top header (frosted glass) |
| `.mobile-tabbar` | `rgba(255,255,255,0.92)` + `blur(14px)` | Fixed bottom tab bar |
| Header/tabbar border | `#edeff2` | Hairline separators (softer than `--border-light`) |
| Card border | `#edeff2` | `.app-card` outline |
| Shadows | `rgba(15,23,42,0.06)` | `0 -6px 24px` (tabbar), `0 4px 18px` (card) — soft slate-grey |
| `.mb-tab-safe` | `calc(74px + safe-area)` | Bottom padding so content clears the tab bar |
| `.snap-row` gap | `0.85rem` | Horizontal scroll-snap carousels |

Tailwind tokens from this file: `bg-app-bg`, `bg-app-surface`,
`text-app-muted`, `rounded-app`.

---

## 3. Standard Tailwind palette in use (semantic status colours)

The apps lean on Tailwind's default scale for state + hierarchy. Percentages ≈
count of utility occurrences across web/admin/hospital source.

### 3.1 Neutral scale (typography + dividers)

| Shade | Hex | Uses | Purpose |
| --- | --- | --- | --- |
| `gray-500` | `#6b7280` | 167 | Secondary text, muted labels (mirrors `--text-secondary-light`) |
| `gray-800` | `#1f2937` | 137 | Heading / strong text (mirrors `--text-primary-light`) |
| `gray-100` | `#f3f4f6` | 132 | Page/section backgrounds (mirrors `--bg-light`) |
| `gray-400` | `#9ca3af` | 104 | Placeholder, disabled, icons |
| `gray-200` | `#e5e7eb` | 71 | Borders, dividers (mirrors `--border-light`) |
| `gray-600` | `#4b5563` | 63 | Secondary-hover text, meta |
| `gray-700` | `#374151` | 57 | Labels, secondary headings |
| `gray-50` | `#f9fafb` | 56 | Row hover, subtle fills |
| `gray-300` | `#d1d5db` | 14 | Disabled borders, ghost UI |
| `gray-900` | `#111827` | — | Deepest text (sparingly) |

`white` (`#ffffff`) appears ~92× for text on brand/pressed states and card
surfaces.

### 3.2 Semantic status & action colours

| Colour | Hex | Count | Meaning / typical use |
| --- | --- | --- | --- |
| `green-600` | `#16a34a` | 47 | Success, confirmed, "available now", positive actions |
| `red-500` | `#ef4444` | 28 | Danger, cancelled, errors, remove |
| `green-500` | `#22c55e` | 18 | Success accents, status dots |
| `blue-600` | `#2563eb` | 18 | Links, info, appointment records |
| `yellow-400` | `#facc15` | 14 | Pending / ratings / warnings |
| `green-50` | `#f0fdf4` | 14 | Success backgrounds |
| `emerald-600` | `#059669` | 14 | Currency, money, health-success |
| `red-600` | `#dc2626` | 13 | Danger hover/strong |
| `red-50` | `#fef2f2` | 19 | Danger backgrounds |
| `blue-50` | `#eff6ff` | 13 | Info backgrounds |
| `emerald-50` | `#ecfdf5` | 11 | Money backgrounds |
| `blue-500` | `#3b82f6` | 9 | Info icons |
| `amber-50` | `#fffbeb` | 9 | Warning backgrounds |
| `green-700` | `#15803d` | 8 | Success emphasis |
| `green-100` | `#dcfce7` | 8 | Success borders |
| `emerald-500` | `#10b981` | 8 | Money accents |
| `yellow-500` | `#eab308` | 7 | "Pending" text |
| `violet-600` | `#7c3aed` | 7 | Secondary brand accent (admin analytics) |
| `amber-600` | `#d97706` | 7 | Warning strong |
| `yellow-600` | `#ca8a04` | 6 | Pending strong |
| `red-400` | `#f87171` | 6 | Soft danger |

Rule of thumb: **fill with a `-50` tint + `text-*-600/700` + `border-*-100`**
for status chips (e.g. `bg-green-50 text-green-600`).

---

## 4. Data visualisation (admin & doctor analytics)

Shared chart palette, defined as the `COLORS` array and used in `Pie` / `Bar` /
`Line` charts (recharts). Order matters — it repeats for slices.

| Order | Hex | Used for |
| --- | --- | --- |
| 1 | `#20c3ae` | **Brand teal** — primary slice (e.g. completed) |
| 2 | `#6366f1` | Indigo |
| 3 | `#f59e0b` | Amber |
| 4 | `#ef4444` | Red |
| 5 | `#3b82f6` | Blue |
| 6 | `#8b5cf6` | Violet |
| 7 | `#ec4899` | Pink |
| 8 | `#10b981` | Emerald |
| 9 | `#f97316` | Orange |
| 10 | `#06b6d4` | Cyan |

Source: `COLORS` in `apps/admin/app/analytics/page.tsx`,
`apps/admin/app/hospital-analytics/page.tsx`,
`apps/hospital/app/doctor-analytics/page.tsx`. The **same hexes** also appear
inline in admin/hospital pages (`#e5e7eb` borders, `#f3f4f6` backgrounds,
`#9ca3af` labels, `#5f6fff`/`#577cff` accents). Brand consistency: `#20c3ae`
repeats the `--primary` token and is placed first.

---

## 5. Assets (SVG artwork)

### 5.1 Brand logo (`logo.svg` in web/admin/hospital)

Flat anchors in the teal family plus a per-channel mint gradient:

| Colour | Hex | Notes |
| --- | --- | --- |
| Teal dark | `#05706d` | Logo fill anchors |
| Deep teal | `#035060` | Logo fill anchors |
| Teal mid | `#02928a` | Logo fill anchors |
| Teal | `#028c8a` | Logo fill anchors |
| Spring-green mid | `#3ed67d` | Gradient mesh (leaf/cross motif) |
| Spring-green | `#3dd688` | Gradient mesh |
| Sea-green | `#3a9e8f`–`#41a19d` | Gradient mesh |
| Green-accent | `#41c394`–`#4bdc93` | Gradient mesh highlights |
| Darker green | `#3ea177`–`#3fc78a` | Gradient mesh |

The logo is a teal→spring-green gradient mark — the free-text SVG has ~800
hexes forming a smooth gradient mesh, so treat **#20c3ae teal + mint green** as
the brand gradient reading.

### 5.2 Icon artwork (admin, hospital, web assets)

| Colour | Hex | Where |
| --- | --- | --- |
| Deep navy | `#1c274c` | Admin icon stroke/primary (`add_icon`, `appointment_icon`, `home_icon`, `patient_icon`, `people_icon`, …) |
| Indigo/blue | `#577cff` | Admin `get_patient`, web `Doctors` accent |
| Periwinkle | `#5f6fff` | Admin/hospital icon accents |
| Soft periwinkle | `#7f9bff`, `#6a8dff` | Icon gradients |
| Ice blue | `#f6f8ff` | Icon light fills (ice/light-blue) |
| Peach | `#f7dece`, `#f2d4b7` | Warm fills (peach/rose tints in doctor/care icons) |
| Pale slate | `#e2e5ed` | Web speciality tile backgrounds (`Dermatologist`, `Gynecologist`…) |
| Blue-grey | `#afc1dc` | Web speciality tile motifs |
| Sky blue | `#0072db`, `#000b6d` | `menu_icon`, `Gynecologist` gradient accents |
| Soft coral | `#ff9494` | Warm-red accent (`Dermatologist`) |

### 5.3 Inline colours in web components

| Hex | Count | Used in |
| --- | --- | --- |
| `#179e8d` | 12 | Hover/gradient teal (brand-hover value used inline in mid blocks) |
| `#577cff` | 10 | Accent blue (cards, `Doctors`) |
| `#f7dece` | 9 | Peach tint fills |
| `#edeff2` | 7 | Hairline borders (mobile style colour in desktop spacing) |
| `#e2e5ed`, `#afc1dc` | 7+7 | Pale slate tiles |
| `#ff9494` | 5 | Soft red accents |
| `#f6f8fa`, `#8a94a3` | 4+3 | Mobile app bg + muted text |
| `#595959`, `#312d2d` | 4+3 | Dark neutral text (legacy typography) |

---

## 6. Dark theme — MongoDB-style inversion

Working name: **`Lagoon Midnight`** (the Lagoon palette at night — moonlight
deep-teal water with the mint/soft glow reflecting on it).

### 6.1 Design principles (from MongoDB's LeafyGreen dark system)

MongoDB's dark mode is the reference:
[`mongodb.design`](https://www.mongodb.design/foundations/palette) +
`mongodb/leafygreen-ui` (the DSL behind mongodb.com, Atlas, Compass, docs).

- **Never pure black.** The dark canvas is `#001E2B` — a deep forest-teal that
  carries the brand colour into the background.
- **Cool, teal-cast greys**, not neutral greys — text ramps (`#E8EDEB` →
  `#C1C7C6` → `#889397`) and border ramps (`#3D4F58` → `#21313C`) all sit in
  the same cool family as the canvas.
- **One bright neon accent used sparingly.** MongoDB uses `#00ED64` for CTAs
  and tiny highlights only. Lagoon uses its own neon mint `#3dd688`
  (taken from HealHub's own logo gradient — an *inversion of this theme*, not
  a wholesale copy of MongoDB's green).
- **Brighter "base" channels in dark mode.** Status colours shift up a band
  (red `#FF6960`, yellow `#FFC010`, blue `#0498EC`) so they read against the
  dark canvas.
- **Teal-tinted shadows** — elevation shadows carry the forest colour
  (`rgba(0, 30, 43, …)`) instead of generic black.
- As with the light theme, the semantic tokens flip but the **utility names
  stay the same** (`text-primary`, `bg-bg`, `border-border`, …).

### 6.2 Token mapping (light → dark)

| HealHub role | Light value | **Dark value** | MongoDB reference |
| --- | --- | --- | --- |
| Page canvas | `#f3f4f6` | **`#001e2b`** | Mongo `black` `#001E2B` |
| App shell bg | `#f6f8fa` | **`#001e2b`** | Mongo `black` |
| Card surface | `#ffffff` | **`#1c2d38`** | Mongo `gray-dark3` `#1C2D38` |
| Elevated surface | — | **`#21313c`** | Mongo `gray-dark3` (alt) |
| Text primary | `#1f2933` | **`#e8edeb`** | Mongo `gray-light2` `#E8EDEB` |
| Text secondary | `#6b7280` | **`#c1c7c6`** | Mongo `gray-light1` `#C1C7C6` |
| Text muted / disabled | `#9ca3af` | **`#889397`** | Mongo `gray-base` `#889397` |
| Border / divider | `#e5e7eb` | **`#3d4f58`** | Mongo `gray-dark2` `#3D4F58` |
| Hairline (mobile) | `#edeff2` | **`#21313c`** | Mongo `gray-dark3` |
| **Brand primary** | `#20c3ae` | **`#3dd688`** | HealHub logo mint (≈ Mongo `#00ED64` role) |
| Primary hover | `#179e8d` | **`#71f6ba`** | Mongo `green-light1` `#71F6BA` |
| Primary soft (chip bg) | `#a6e9e1` | **`#134e4a`** | existing HealHub `--primary-soft-dark` |
| Chip text on soft | `#134e4a` | **`#a6e9e1`** | existing HealHub `--primary-soft` |
| CTA / danger | `#ff6b6b` | **`#ff6960`** | Mongo `red-light1` `#FF6960` |
| Warning | `#f4d35e` | **`#ffc010`** | Mongo `yellow-base` `#FFC010` |
| Link | `#3a4f7a` | **`#0498ec`** | Mongo `blue-light1` `#0498EC` |
| Success | `green` family | **`#00ed64` / `#71f6ba`** | Mongo `green-base`/`light1` |
| Focus ring | `#20c3ae` | **`#3dd688`** | — |
| Elevation shadow | `rgba(15,23,42,0.06)` | **`rgba(0,30,43,0.5)`** | Forest-tinted |

Rules inherited from MongoDB: the neon mint (`#3dd688`) is an *accent*, never
a full-surface fill; backgrounds are always `#001e2b`-family, never pure
`#000`.

### 6.3 Implementation (semantic role tokens)

The current `@theme inline` block hard-codes values, so a dark flip needs the
variables to be **semantic roles** that override under `.dark` (or
`@media (prefers-color-scheme: dark)`):

```css
:root {
  color-scheme: light;
  --primary: #20c3ae;
  --primary-hover: #179e8d;
  --primary-soft: #a6e9e1;
  --primary-soft-dark: #134e4a;
  --bg: #f3f4f6;
  --bg-card: #ffffff;
  --text-primary: #1f2933;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --border: #e5e7eb;
  --border-soft: #edeff2;
  --cta: #ff6b6b;
  --warning: #f4d35e;
  --link: #3a4f7a;
}

.dark {
  color-scheme: dark;
  --primary: #3dd688;
  --primary-hover: #71f6ba;
  --primary-soft: #134e4a;
  --primary-soft-dark: #a6e9e1;
  --bg: #001e2b;          /* MongoDB forest canvas */
  --bg-card: #1c2d38;
  --text-primary: #e8edeb;
  --text-secondary: #c1c7c6;
  --text-muted: #889397;
  --border: #3d4f58;
  --border-soft: #21313c;
  --cta: #ff6960;
  --warning: #ffc010;
  --link: #0498ec;
}

@theme inline {
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-primary-soft-dark: var(--primary-soft-dark);
  --color-bg: var(--bg);
  --color-bg-card: var(--bg-card);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-border: var(--border);
  --color-border-soft: var(--border-soft);
  --color-accent-cta: var(--cta);
  --color-accent-warning: var(--warning);
  --color-accent-link: var(--link);
}
```

Utilities produced by this block: `bg-bg`, `bg-bg-card`, `text-text-primary`,
`text-text-secondary`, `text-text-muted`, `border-border`, `border-border-soft`,
`bg-primary`, `text-primary`, `bg-accent-cta`, … — identical names in both
modes, values flip at the variable level.

> **Bonus:** this naming scheme is exactly the cleanup recommended in
> *Known issues* (§8.1). `text-text-secondaryLight` → `text-text-secondary`,
> `bg-background-cardLight` → `bg-bg-card`, `text-text-primaryLight` →
> `text-text-primary`. Adopting dark mode fixes the camelCase bug in one pass.

Toggle strategy: ship `.dark` on `<html>` (manual switcher) and/or sync with
`@media (prefers-color-scheme: dark)`; Tailwind v4 also supports
`@custom-variant dark (&:where(.dark, .dark *));` for the `dark:`
variant.

### 6.4 Dark adjustments to the mobile layer

| Element | Light | Dark |
| --- | --- | --- |
| `.app-screen`, `--app-bg` | `#f6f8fa` | `#001e2b` |
| `--app-surface` / `.app-card` | `#ffffff` | `#1c2d38` |
| `--app-muted` | `#8a94a3` | `#889397` |
| Header/tabbar glass | `rgba(255,255,255,0.9)` | `rgba(28,45,56,0.9)` + blur |
| Hairline borders | `#edeff2` | `#3d4f58` |
| Card / bar shadows | `rgba(15,23,42,0.06)` | `rgba(0,30,43,0.5)` |

### 6.5 Dark-mode chart palette

Take the light chart `COLORS` (§4) and lift each hue one brightness band
(500/600 → 400) so it reads on `#001e2b`:

| Order | Light | **Dark** |
| --- | --- | --- |
| 1 | `#20c3ae` | **`#3dd688`** |
| 2 | `#6366f1` | **`#818cf8`** |
| 3 | `#f59e0b` | **`#fbbf24`** |
| 4 | `#ef4444` | **`#f87171`** |
| 5 | `#3b82f6` | **`#60a5fa`** |
| 6 | `#8b5cf6` | **`#a78bfa`** |
| 7 | `#ec4899` | **`#f472b6`** |
| 8 | `#10b981` | **`#34d399`** |
| 9 | `#f97316` | **`#fb923c`** |
| 10 | `#06b6d4` | **`#22d3ee`** |

### 6.6 Contrast (WCAG 2.1 AA)

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `#e8edeb` on `#001e2b` | ≈ 16:1 | AAA ✓ |
| `#c1c7c6` on `#001e2b` | ≈ 10:1 | AAA ✓ |
| `#889397` on `#001e2b` | ≈ 4.5:1 | AA ✓ (muted/disabled only) |
| `#3dd688` on `#001e2b` | ≈ 9:1 | AAA ✓ (large/CTA) |
| `#3dd688` on `#134e4a` (chip) | ≈ 5:1 | AA ✓ |

---

## 7. Semantic quick reference

| Role | Light | Dark |
| --- | --- | --- |
| Brand / primary CTA | `#20c3ae` (hover `#179e8d`) | `#3dd688` (hover `#71f6ba`) |
| Brand tint / chip | `#a6e9e1` bg + `#134e4a` text | `#134e4a` bg + `#a6e9e1` text |
| Page background | `#f3f4f6` (desktop) / `#f6f8fa` (app) | `#001e2b` |
| Card surface | `#ffffff` | `#1c2d38` |
| Primary text | `#1f2933` | `#e8edeb` |
| Secondary text | `#6b7280` / `#9ca3af` | `#c1c7c6` / `#889397` |
| Border / divider | `#e5e7eb` (hairline `#edeff2`) | `#3d4f58` (hairline `#21313c`) |
| Success | `green` 50/500/600/700 | `#00ed64` / `#71f6ba` |
| Danger / warning CTA | `red` family; `#ff6b6b` | `#ff6960` |
| Pending / ratings | `#f4d35e`, `#facc15` | `#ffc010` |
| Info / links | `blue` family; `#3a4f7a` | `#0498ec` |
| Money / health-success | `emerald` family | `#00ed64`-family |
| Secondary analytics accent | chart COLORS (§4) | dark chart (§6.5) |
| Chart lead slice | `#20c3ae` | `#3dd688` |

---

## 8. Known issues & recommendations

1. **CamelCase utility classes do not resolve.** The tokens are kebab-cased
   with a `-light`/`-dark` suffix (`--color-background-card-light`), but the
   code still references the pre-refactor camelCase names:

   | Used in code | Count | Verdict (compiled CSS check) |
   | --- | --- | --- |
   | `text-text-secondaryLight` | 183 | ❌ not in compiled CSS |
   | `text-text-primaryLight` | 65 | ❌ not in compiled CSS |
   | `bg-background-cardLight` | 22 | ❌ not in compiled CSS |
   | `text-text-primary` / `text-text-secondary` / `bg-background-card` | 0 | ❌ token does not exist (`-light`/`-dark` suffix required) |

   These elements currently inherit the surrounding colour instead of their
   intended token. **Fix:** sweep-replace camelCase forms with kebab
   (`text-text-secondaryLight` → `text-text-secondary-light`, etc.) across
   `apps/*/src`. The correct classes already resolve: `text-text-primary-light`,
   `text-text-secondary-light`, `bg-background-card-light`.

2. **Two neutral systems coexist** — token grays (`--text-secondary-light`,
   `--border-light`) and Tailwind `gray-*` (`gray-500` ≈ `#6b7280`,
   `border-gray-200` ≈ `#e5e7eb`). They are nearly identical; consolidation is
   optional.

3. **`color-scheme: light`** is hard-set. The `-dark` tokens and `--bg-dark`
   surface exist but are unused while the app stays light-only.

4. **Hard-coded brand hexes** (e.g. `#179e8d` ×12, `#20c3ae` ×11, `#577cff`)
   in components/SVGs drift from tokens. Prefer `--color-primary`/`--color-primary-hover`.

5. **SVG logo gradient** is a huge embedded mesh; if the brand is ever
   recoloured, regenerate the SVG rather than hand-editing ~800 hex values.