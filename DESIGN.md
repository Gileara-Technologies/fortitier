# Fortitier Logistics — Design system

**Status:** v1 binding  
**Brand source:** Ideaverse Fortitier visual system + logo pack  
**Stack craft reference:** Gileara web architecture (patterns only — not palette or copy)

## Design read

B2B industrial logistics marketing for OMC, station, mine, and industrial buyers in Ghana. Trust-first, disciplined, sparse. Not a startup SaaS landing template.

## Dials

| Dial | Value | Reason |
|------|-------|--------|
| Variance | 4 | Trust-first industrial; restrained layout |
| Motion | 3 | Section reveals only; reduced-motion safe |
| Density | 5 | Clear service detail without cockpit clutter |

## Tokens

| Token | Hex | Use |
|-------|-----|-----|
| gold | `#DFA040` | Primary CTA, links, highlights |
| gold-light | `#FBCF6A` | Hover, soft highlights |
| bronze | `#AC7023` | Icons, secondary accent, labels |
| brown | `#3B1902` | Headings, footer, dark bands |
| black | `#000000` | Ink / F-mark energy |
| white | `#FFFFFF` | Page background |
| paper-warm | `#FBF7F2` | Warm off-white surfaces |
| paper-sand | `#F3EBE0` | Section alternate |

Gradients only along gold → bronze (logo swoosh family). **Never teal/cyan.**

## Typography

| Role | Face | Load |
|------|------|------|
| Display / headings | IBM Plex Sans | `next/font` |
| Body | Inter | `next/font` |
| Instrument / meta | JetBrains Mono | trip-like labels, chips, phone |

## Components

- One `Navbar` with `variant`: `default` | `legal`
- One CTA verb: **Request haulage** → `/contact`
- `StatusChip` for `available` | `roadmap` | `scenario` | …
- FAQ accordion with real button/region semantics
- Contact form: company, role, segment, product, route, volume, phone, email, message

## Honesty

- No fabricated KPIs
- Service 6 = roadmap chip
- Scenarios labeled until real case studies exist
- Phone/email/domain swapped only in `src/content/site-config.ts`

## A11y

- Skip link, focus-visible gold ring
- Mobile nav as dialog with Escape + body scroll lock
- `prefers-reduced-motion` disables reveals and CSS animation
- Tap-to-call on mobile header

## 3D signature (v2)

The site is built around three instruments rather than stock imagery:

1. **Hero tanker**: a procedural Fortitier tanker on a dusk highway.
2. **Corridor planner**: a 3D relief of Ghana where the visitor draws a lane (depot, destination, product) and sends it to dispatch pre-filled.
3. **The Trip**: a scroll-driven cutaway of load, track, deliver, reconcile, ending on a balance scale.

All scenes are code-owned, labeled `SIMULATION`, have DOM fallbacks and a reduced-motion frame. Details, budgets and rules: [`docs/3D.md`](./docs/3D.md).
Light surfaces carry the content; deep brown (`#0c0602` to `#3B1902`) carries every 3D band. Gold is the only accent.
