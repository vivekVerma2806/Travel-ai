# PATHORA DESIGN SYSTEM SPECIFICATION

**Product Name:** Pathora  
**Tagline:** *Every Journey Has a Path.*  
**Version:** 2.0 (Production Release)  
**Brand Identity Authority:** Official Pathora Artwork & Santorini caldera UI reference  

---

## 1. Brand Identity & Authority

Pathora's visual language is derived directly from its authoritative mark:
- **Mountain Silhouette:** Deep Midnight Navy (`#0A1628`) symbolizing endurance, majesty, and unyielding exploration.
- **Winding River / Path:** Vivid Teal (`#00B4D8`) to Electric Cyan (`#00E5FF`) symbolizing clarity, guidance, fluid planning, and modern artificial intelligence.
- **Sunset Horizon:** Warm Sunset Orange (`#FF6B35`) to Amber Sunset (`#FF8C42`) symbolizing wanderlust, discovery, warmth, and golden hour inspiration.
- **Waypoint Beacon:** Clean Map Pin White (`#FFFFFF`) with contrasting navy center.

This system rejects generic AI purple/violet gradients in favor of an authentic, high-contrast, Mediterranean-meets-alpine palette.

---

## 2. Color System & Design Tokens

### 2.1 Core Palette

| Token Name | HEX | RGB | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `--color-pathora-navy` | `#0A1628` | `rgb(10, 22, 40)` | Primary brand background, heavy headings, dark sidebar |
| `--color-pathora-navy-light` | `#16243C` | `rgb(22, 36, 60)` | Elevated dark surfaces, card borders in dark mode |
| `--color-pathora-teal` | `#00B4D8` | `rgb(0, 180, 216)` | Primary action color, active tabs, map markers, primary icons |
| `--color-pathora-teal-hover` | `#0096B4` | `rgb(0, 150, 180)` | Hover state for primary buttons and interactive links |
| `--color-pathora-cyan` | `#00E5FF` | `rgb(0, 229, 255)` | Accent highlights, glowing borders, active badges |
| `--color-pathora-orange` | `#FF6B35` | `rgb(255, 107, 53)` | Primary CTA buttons, attention callouts, badge notifications |
| `--color-pathora-orange-hover`| `#E85D26` | `rgb(232, 93, 38)` | Hover state for orange CTA buttons |
| `--color-pathora-bg` | `#F8FAFC` | `rgb(248, 250, 252)`| App canvas background, subtle card backdrop |
| `--color-pathora-surface` | `#FFFFFF` | `rgb(255, 255, 255)`| Pure white component background, modals, cards |
| `--color-pathora-border` | `#E2E8F0` | `rgb(226, 232, 240)`| Subtle borders, divider rules |

### 2.2 Semantic & State Colors

| Role | HEX | Background Light | Border Token | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Verified** | `#10B981` | `#ECFDF5` (`bg-emerald-50`) | `#A7F3D0` | Approved booking, active trip, verified user badge |
| **Warning / Pending** | `#F59E0B` | `#FFFBEB` (`bg-amber-50`) | `#FDE68A` | Pending organizer validation, review requested |
| **Error / Destructive**| `#EF4444` | `#FEF2F2` (`bg-rose-50`) | `#FECDD3` | Cancelled trip, rejected join request, delete action |
| **Information / Notice**| `#0284C7` | `#F0F9FF` (`bg-sky-50`) | `#BAE6FD` | AI hints, date badges, route notes |

---

## 3. Typography Architecture

### 3.1 Font Families
- **Display & Headings:** `Plus Jakarta Sans` (weights: 600 SemiBold, 700 Bold, 800 ExtraBold, 900 Black). Google Fonts open license.
- **Body & Controls:** `Inter` (weights: 400 Regular, 500 Medium, 600 SemiBold). Clean, highly legible at small sizes on desktop and mobile viewports.

### 3.2 Scale & Hierarchy

| Level | Size (px / rem) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `56px / 3.5rem` | 800 ExtraBold | 1.1 | `-0.025em` | Landing page hero main statement |
| **Display 2** | `40px / 2.5rem` | 800 ExtraBold | 1.15 | `-0.02em` | Section anchors, auth card headlines |
| **Heading 1** | `30px / 1.875rem` | 700 Bold | 1.25 | `-0.015em` | Dashboard titles, trip detail hero |
| **Heading 2** | `24px / 1.5rem` | 700 Bold | 1.3 | `-0.01em` | Card group titles, modal headers |
| **Heading 3** | `18px / 1.125rem` | 600 SemiBold | 1.4 | `normal` | Card titles, itinerary day titles |
| **Body Large** | `16px / 1.0rem` | 400 Regular | 1.6 | `normal` | Hero subtitles, editorial descriptions |
| **Body Regular**| `14px / 0.875rem` | 400 / 500 | 1.5 | `normal` | Form inputs, table data, body text |
| **Caption / Tag**| `12px / 0.75rem` | 600 / 700 | 1.4 | `0.05em` (Caps) | Category badges, metadata, timestamps |
| **Micro** | `10px / 0.625rem` | 700 Bold | 1.2 | `0.08em` (Caps) | Status badges, chip labels |

---

## 4. Spacing, Elevation & Surfaces

### 4.1 Spacing Scale
- `2xs`: `4px` (`0.25rem`) — Pill internal gaps
- `xs`: `8px` (`0.5rem`) — Badge padding, icon gap
- `sm`: `12px` (`0.75rem`) — Button vertical padding, small card gap
- `md`: `16px` (`1.0rem`) — Input padding, grid gap on mobile
- `lg`: `24px` (`1.5rem`) — Card internal padding, desktop grid gutters
- `xl`: `32px` (`2.0rem`) — Section gaps, modal padding
- `2xl`: `48px` (`3.0rem`) — Dashboard spacing, landing page margins
- `3xl`: `64px+` (`4.0rem+`) — Hero margins, major section rhythm

### 4.2 Elevation & Shadows
- **Card Default:** `box-shadow: 0 1px 3px 0 rgba(10, 22, 40, 0.05), 0 1px 2px -1px rgba(10, 22, 40, 0.05);` (`shadow-xs`)
- **Card Hover:** `box-shadow: 0 10px 25px -5px rgba(10, 22, 40, 0.08), 0 8px 10px -6px rgba(10, 22, 40, 0.04);` (`shadow-md`)
- **Teal Primary Glow:** `box-shadow: 0 10px 20px -3px rgba(0, 180, 216, 0.25);`
- **Orange CTA Glow:** `box-shadow: 0 10px 20px -3px rgba(255, 107, 53, 0.25);`
- **Glassmorphism Backdrop:** `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(255, 255, 255, 0.2);`

---

## 5. Component Standards

### 5.1 Buttons
- **Primary Action (Default):** `#00B4D8` Vivid Teal with white text, `border-radius: 12px` (`rounded-xl`), font weight 700. Hover: `#0096B4` with `-translate-y-0.5`.
- **Hero & Key Conversion (Accent):** `#FF6B35` Sunset Orange with white text. Hover: `#E85D26`.
- **Secondary / Ghost:** White background, `border: 1px solid #E2E8F0`, slate-700 text, hover border `#00B4D8` and text `#00B4D8`.
- **Destructive:** `#EF4444` Rose with white text or white with rose-600 border.

### 5.2 Forms & Inputs
- Height: `44px` on desktop, `46px` on mobile touch targets.
- Rounded corners: `12px` (`rounded-xl`).
- Default state: `border: 1px solid #E2E8F0`, background `#FFFFFF`.
- Focus state: `border: 1px solid #00B4D8`, `box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15)`, outline none.
- Label: uppercase, size `11px`, weight 700, color `#64748B` (`slate-500`).

### 5.3 Travel & Destination Cards
- Standard aspect ratio: `3:4` vertical for destination exploration, `16:9` for itinerary banners.
- Corner radius: `16px` (`rounded-2xl`).
- Zoom on hover: `group-hover:scale-105` over `500ms cubic-bezier(0.16, 1, 0.3, 1)`.
- Status badges: upper-right or upper-left pill with `font-bold text-[10px] tracking-wider uppercase`.

---

## 6. Motion & Animation System

### 6.1 Principles
1. **Purposeful Feedback:** Every motion signifies state change (loading, expanding, saving, navigating).
2. **Speed & Snappiness:** Everyday interactions must never exceed `200ms–250ms` to keep the UI feeling instant.
3. **Cinematic Hero Entry:** Landing hero transitions use staged staggered reveals (`400ms–600ms`).
4. **Hardware Acceleration:** All animations utilize `transform` (`translate3d`, `scale`) and `opacity` to avoid layout thrashing.

### 6.2 Motion Tokens
- **Fast / Micro:** `150ms cubic-bezier(0.4, 0, 0.2, 1)` — Button press, icon toggle, tooltip.
- **Normal / Transition:** `250ms cubic-bezier(0.16, 1, 0.3, 1)` — Modal entrance, dropdown fade, card hover.
- **Slow / Stagger:** `450ms cubic-bezier(0.16, 1, 0.3, 1)` — Route transition, timeline expansion, hero copy entry.
- **Infinite / Ambient:** `spin 8s linear infinite` / `pulse 2s ease-in-out infinite` — Map orbit, loader ring.

### 6.3 Accessibility (`prefers-reduced-motion`)
All animations honor user accessibility settings:
```css
@media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 7. Responsiveness & Breakpoints

Pathora is fully responsive across all device classes:
- **Mobile (`< 640px`):** Single-column stacked layouts, fixed bottom/drawer navigation, 44px+ touch targets, swipeable horizontal destination carousels.
- **Tablet (`640px – 1024px`):** 2-column card grids, flexible itinerary timeline with sticky map preview.
- **Desktop (`>= 1024px`):** 3-column / 4-column destination grids, split itinerary/map layout, full sidebar navigation for dashboards.
- **Wide Screens (`>= 1280px`):** Max container width `1280px` (`max-w-7xl`) centered with generous breathing room.
