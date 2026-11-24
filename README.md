# Fortitier Logistics — corporate website

Production marketing site for **Fortitier Logistics Limited**, a Ghanaian **bulk fuel haulage** company (petrol, diesel, gasoil).

> Ghanaian bulk fuel haulage — safe, accountable, on time. Every trip tracked. Every litre reconciled.

## Stack

- Next.js App Router (TypeScript strict)
- Tailwind CSS design tokens (Fortitier gold / bronze / brown)
- SSG-first pages; `/api/contact` for haulage requests
- React Three Fiber scenes (procedural, no external assets): see [`docs/3D.md`](./docs/3D.md)
- Cloudflare deploy path via OpenNext (`build:cf`, `wrangler.toml`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run secrets:scan
```

## Content single sources

| Module | Role |
|--------|------|
| `src/content/site-config.ts` | Name, phone, email, domain, CTA, SEO |
| `src/content/services.ts` | Six services (6 = roadmap) |
| `src/content/faqs.ts` | FAQ + JSON-LD |
| `src/content/about.ts` | Story, pillars, audiences, haul steps |
| `src/content/scenarios.ts` | Labeled scenarios (not fake case studies) |
| `src/content/nav.ts` | Primary / legal / footer links |

## Routes

| Path | Purpose |
|------|---------|
| `/` | Logistics homepage story |
| `/services` | Full service detail + anchors |
| `/how-we-haul` | Operating method |
| `/about` | Company identity |
| `/faq` | Logistics FAQs |
| `/contact` | Haulage request form |
| `/privacy` `/terms` | Legal stubs (Act 843 high level) |

## Brand

Logo files: `public/brand/fortitier-logo.jpeg`, `fortitier-logo-icon.jpg`  
Design system: [`DESIGN.md`](./DESIGN.md)  
Secrets: [`docs/SECRETS.md`](./docs/SECRETS.md)

## Deploy (Cloudflare)

```bash
npm run build:cf
npx wrangler secret put RESEND_API_KEY   # optional
npm run deploy:worker
```

Point `fortitier.com` DNS to Cloudflare when ready (phase 4 ops).

## Not this brand

Do not mix Gileara Technologies palette, copy, packages, or logos into this repo.
