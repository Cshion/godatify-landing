# Project Structure

## Root

```
godatify-landing/
├── frontend/          # Next.js 16 application (Vercel)
├── backend/           # Strapi 5 CMS (EC2)
├── docs/              # Technical documentation
├── scripts/           # Infrastructure scripts
├── DEPLOYMENT.md      # Deployment runbook
└── .squad/            # AI team framework config
```

---

## Frontend (`frontend/`)

```
frontend/
├── next.config.ts           # Next.js config (image domains, etc.)
├── vercel.json              # Vercel deployment: headers, rewrites, redirects
├── tailwind.config / postcss.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   └── images/
│       └── partners/        # Partner SVG logos (AWS, Azure, GCP, Power BI, Databricks)
└── src/
    ├── app/                 # Next.js App Router
    │   ├── layout.tsx       # Root layout (fonts, header, footer)
    │   ├── page.tsx         # Home page (/)
    │   ├── globals.css      # Global styles
    │   ├── robots.ts        # robots.txt generation
    │   ├── sitemap.ts       # sitemap.xml generation
    │   ├── actions/         # Server actions
    │   ├── blog/            # /blog and /blog/[slug]
    │   ├── casos/           # /casos and /casos/[slug]
    │   ├── contacto/        # /contacto
    │   ├── industrias/      # /industrias and /industrias/[slug]
    │   ├── nosotros/        # /nosotros
    │   └── servicios/       # /servicios and /servicios/[slug]
    ├── components/
    │   ├── blog/            # Blog list and post components
    │   ├── casos/           # Case study components
    │   ├── common/          # Shared across pages (PartnerLogos, etc.)
    │   ├── contact/         # Contact form components
    │   ├── industrias/      # Industry page components
    │   ├── layout/          # Header, Footer, Navigation
    │   ├── nosotros/        # About page components
    │   ├── sections/        # Home page sections (Hero, Services, Cases, etc.)
    │   ├── servicios/       # Service page components
    │   └── ui/              # Generic UI primitives (ScrollReveal, etc.)
    ├── data/
    │   └── blog-data.ts     # Static blog fallback / type definitions
    ├── lib/
    │   ├── api.ts           # CMS API client (typed fetch + qs)
    │   ├── fontawesome.ts   # FontAwesome library initialization
    │   ├── formatDate.ts    # Date formatting utility
    │   ├── schemas.ts       # Zod/validation schemas (contact form)
    │   └── seo.ts           # Shared OG/SEO metadata helpers
    └── types/
        └── index.ts         # Shared TypeScript type definitions
```

### Key Frontend Files

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — loads fonts, Header, Footer, Analytics |
| `src/app/page.tsx` | Home page — fetches all home data in one API call |
| `src/lib/api.ts` | Central CMS client — all data fetching goes through here |
| `src/lib/seo.ts` | OG image, meta title/description helpers |
| `src/components/common/PartnerLogos.tsx` | Infinite marquee of 5 technology partner logos |
| `src/components/common/PartnerLogos.module.css` | CSS animation for the marquee loop |
| `vercel.json` | Security headers, CDN cache rules, API proxy rewrite |

---

## Backend (`backend/`)

```
backend/
├── package.json
├── tsconfig.json
├── ecosystem.config.js      # PM2 process config (production)
├── Makefile                 # Dev shortcuts
├── config/
│   ├── api.ts               # REST API settings
│   ├── admin.ts             # Admin panel config
│   ├── database.ts          # PostgreSQL / SQLite connection
│   ├── middlewares.ts       # CORS, body parser, etc.
│   ├── plugins.ts           # Plugin registration
│   └── server.ts            # Server host/port config
├── src/
│   ├── index.ts             # Strapi entry point
│   ├── api/                 # Content type APIs (auto-generated)
│   │   ├── about-page/
│   │   ├── author/
│   │   ├── blog-page/
│   │   ├── blog-post/
│   │   ├── case-study/
│   │   ├── cases-page/
│   │   ├── client/
│   │   ├── company-info/
│   │   ├── contact-page/
│   │   ├── contact-submission/
│   │   ├── home-page/
│   │   ├── industries-page/
│   │   ├── industry/
│   │   ├── sector/
│   │   ├── service/
│   │   ├── social-link/
│   │   └── testimonial/
│   └── bootstrap/           # Custom startup logic
│       ├── index.ts         # Bootstrap entry
│       ├── config.ts        # Bootstrap configuration
│       ├── master-data.ts   # Seeds master/canonical data
│       ├── mock-data.ts     # Seeds mock/demo data (dev only)
│       ├── permissions.ts   # Sets public API permissions
│       ├── indexes.ts       # DB index creation
│       ├── lifecycle-hooks.ts
│       ├── repairs.ts       # Data repair utilities
│       ├── sync.ts          # Content sync helpers
│       └── utils.ts
├── seed-data/
│   ├── master/              # Canonical JSON seed files
│   └── mock/                # Demo JSON seed files
├── scripts/
│   ├── seed.ts              # Manual seed script
│   └── reset.ts             # Database reset script
└── database/
    └── migrations/          # Strapi database migrations
```

### Key Backend Files

| File | Purpose |
|---|---|
| `config/database.ts` | DB connection (SQLite in dev, PostgreSQL in prod) |
| `config/middlewares.ts` | CORS configuration (allow frontend origin) |
| `src/bootstrap/index.ts` | Auto-seeds on startup, sets API permissions |
| `src/bootstrap/permissions.ts` | Makes public content types accessible without auth |
| `src/api/blog-post/content-types/blog-post/schema.json` | Blog post schema — `tags` is `json` type |
| `ecosystem.config.js` | PM2 config for production process management |

---

## Docs (`docs/`)

```
docs/
├── DEPLOYMENT.md                   # ← Deployment runbook (DO NOT RECREATE)
├── ROADMAP.md                      # Project status and roadmap
├── cloudflare-setup.md             # ← Cloudflare setup guide (DO NOT RECREATE)
└── architecture/
    ├── ARCHITECTURE.md             # System overview and tech stack
    ├── DATA_MODEL.md               # Content types and field schemas
    └── PROJECT_STRUCTURE.md        # This file
```

---

## Scripts (`scripts/`)

```
scripts/
├── deploy.sh            # Deployment automation
├── setup-ec2.sh         # EC2 server provisioning
└── cloudflare-ips.sh    # Fetch Cloudflare IP ranges for firewall rules
```
