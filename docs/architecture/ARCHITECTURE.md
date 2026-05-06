# Architecture Overview

## System Overview

Datify's landing platform is a decoupled architecture: a Next.js frontend consumes content from a headless Strapi CMS, backed by PostgreSQL, and served through Cloudflare CDN.

```
User → Cloudflare CDN → Vercel (Next.js 16) → Strapi 5 API (EC2) → PostgreSQL
```

---

## Tech Stack

| Layer | Technology | Version | Purpose | Deployment |
|---|---|---|---|---|
| Frontend | Next.js | 16.0.7 | SSR/SSG landing pages | Vercel |
| UI Framework | React | 19.2.0 | Component rendering | Vercel |
| Styling | Tailwind CSS | v4 | Utility-first CSS | Bundled |
| CMS | Strapi | 5.31.3 | Headless content API | AWS EC2 |
| Database | PostgreSQL (via `pg`) | — | Content persistence | EC2 / RDS |
| CDN | Cloudflare | — | DDoS, caching, DNS | Cloudflare |
| Analytics | Vercel Analytics + Speed Insights | 2.x | Traffic & performance | Vercel |
| Uploads | AWS S3 (via Strapi provider) | — | Media storage | S3 |
| Rich Text | @strapi/blocks-react-renderer | 1.0.2 | Render Strapi blocks | Frontend |
| Icons | FontAwesome | 7.x | UI icons | Bundled |

---

## Component Architecture

### Section Components (`components/sections/`)
Top-level page sections:
- `Hero` — full-screen hero with dynamic content
- `Nosotros` — stats, video config, about summary
- `Services` — service cards grid
- `Cases` — case study highlights
- `Testimonials` — client testimonials carousel
- `Clients` — client logo grid

### Common Components (`components/common/`)
Shared across pages:

**`PartnerLogos`** — Infinite CSS marquee carousel  
- Displays 5 technology partner logos: AWS, Azure, Google Cloud, Power BI, Databricks
- Logos loaded from `/public/images/partners/*.svg`
- List duplicated to create seamless loop (10 cards total)
- Pure CSS animation via `PartnerLogos.module.css`
- Label: "Tecnologías con las que trabajamos"
- Integrated on: Home (`/`), Nosotros (`/nosotros`), Servicios detail pages (`/servicios/[slug]`)

### Layout Components (`components/layout/`)
Persistent shell: Header, Footer, navigation.

### UI Components (`components/ui/`)
Utilities: `ScrollReveal`, etc.

### Page-Specific Components
Organized by route: `blog/`, `casos/`, `contact/`, `industrias/`, `nosotros/`, `servicios/`

---

## Data Flow

```
Next.js Page (async Server Component)
    ↓
lib/api.ts  (typed fetch wrapper, builds query strings via `qs`)
    ↓
/api/cms/:path*  (Vercel rewrite → https://api.godatify.com/api/*)
    ↓
Strapi 5 REST API (EC2)
    ↓
PostgreSQL (content persistence)
```

- All CMS calls are made server-side (Next.js Server Components).
- The Vercel rewrite proxies `/api/cms/*` → `https://api.godatify.com/api/*`, avoiding direct CMS exposure.
- Data is fetched per-page with typed response models in `lib/api.ts`.

---

## Key Integration Points

| Integration | Mechanism | Notes |
|---|---|---|
| CMS API | Vercel rewrite `/api/cms/*` | Hides origin URL from client |
| Rich text content | `@strapi/blocks-react-renderer` | Blog post `content` field (blocks type) |
| Images (partner logos) | Static SVGs in `public/` | Served by Vercel, cached by Cloudflare |
| Media uploads | Strapi S3 provider | CMS-managed images (case studies, blog covers) |
| Blog tags | JSON array field in Strapi | Frontend parses `tags: string[]` |

---

## Security Headers

Configured in `vercel.json`, applied via Vercel edge:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

---

## Performance & Caching Strategy

| Asset Type | Cache-Control | Notes |
|---|---|---|
| Next.js static chunks (`/_next/static/`) | `max-age=31536000, immutable` | Fingerprinted — safe to cache forever |
| Public images (`/images/`) | `max-age=86400, stale-while-revalidate=604800` | 1 day fresh, 7 days stale |
| Fonts (`/fonts/`) | `max-age=31536000, immutable` | Stable filenames |

- Vercel edge handles header injection.
- Cloudflare sits in front of Vercel and respects these cache directives.
- Strapi responses are not cached at the CDN layer — Next.js ISR/SSG can be used per route.

---

## OG / Social Sharing

- OG image configuration is set in `lib/seo.ts`.
- Applies to all major pages via Next.js `metadata` exports.
- Regions deployed: `iad1` (US East), `sfo1` (US West) for latency to Latin American users.
