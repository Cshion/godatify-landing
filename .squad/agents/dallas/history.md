# Dallas — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Stack:** Next.js 16 + React 19 + TailwindCSS 4
- **Language:** Spanish corporate landing page for data consultancy "Datify"

## Core Context

- Frontend at `frontend/src/`
- App Router pages at `frontend/src/app/`
- Components at `frontend/src/components/` (organized by feature: blog, casos, common, contact, etc.)
- Data fetching at `frontend/src/data/` and `frontend/src/lib/api.ts`
- Global styles at `frontend/src/app/globals.css`

## Learnings

### NPM Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server at http://localhost:3000 |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint |

### Key Dependencies
- **Runtime:** `next@16.0.7`, `react@19.2.0`, `react-dom@19.2.0`
- **CMS Integration:** `@strapi/blocks-react-renderer@1.0.2` (for rendering Strapi rich text)
- **Query Building:** `qs@6.14.0` (for building Strapi REST API query strings)
- **Styling:** `tailwindcss@4`, `@tailwindcss/postcss@4`
- **Analytics:** `@vercel/analytics`, `@vercel/speed-insights`
- **Icons:** `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/react-fontawesome`

### Environment Variables
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337  # Default, connects to local Strapi
```

### Data Fetching Architecture
**Pattern:** BFF (Backend-for-Frontend) via `frontend/src/lib/api.ts`

The `api` object is the **single source of truth** for all data fetching:
- Fetches from Strapi REST API with built-in fallback to static data
- Uses `qs` library to build query parameters for Strapi
- All methods use `cache: 'no-store'` for fresh data
- Graceful fallback: On API failure, returns data from `frontend/src/data/*.ts` files

**Key API Methods:**
- `api.company.getGlobalData()` → Header/Footer data (company info, nav links, services nav)
- `api.home.getData()` → Home page sections (hero, stats, services, cases, testimonials, clients)
- `api.services.getDetailPageData(slug)` → Individual service page with related cases
- `api.cases.getPageData()` → Cases listing page
- `api.cases.getDetailPageData(slug)` → Individual case study
- `api.blog.getPosts({ start, limit })` → Paginated blog posts
- `api.blog.getPostBySlug(slug)` → Individual blog post
- `api.industries.getSectors()` → Industries/sectors hierarchical data

### App Router Structure
```
frontend/src/app/
├── layout.tsx        # Root layout, fetches global data, renders Header/Footer
├── page.tsx          # Home page - renders all homepage sections
├── globals.css       # Tailwind v4 theme + custom CSS variables
├── robots.ts         # SEO robots configuration
├── sitemap.ts        # Dynamic sitemap generation
├── actions/          # Server Actions for pagination
│   ├── blog.ts       # getMorePosts() - infinite scroll
│   └── cases.ts      # getMoreCases() - infinite scroll
├── blog/             # Blog pages
│   ├── page.tsx      # Blog listing
│   └── [slug]/       # Dynamic blog post routes
├── casos/            # Case studies
│   └── [slug]/       # Dynamic case study routes
├── contacto/         # Contact page
├── industrias/       # Industries page
├── nosotros/         # About us page
└── servicios/        # Services
    └── [slug]/       # Dynamic service detail routes
```

### Component Organization
```
frontend/src/components/
├── layout/           # Header.tsx, Footer.tsx (with CSS modules)
├── sections/         # Home page sections: Hero, Nosotros, Clients, Services, Cases, Testimonials
├── ui/               # Reusable UI: Carousel.tsx, ScrollReveal.tsx
├── blog/             # Blog-specific: BlogHero, BlogList, PostCard
├── casos/            # Case-specific: CasesGrid, CaseHero
├── servicios/        # Service-specific: ServiceHero, ServiceFeatures, ServiceMethodology, ServiceTechStack
├── common/           # Shared components
├── contact/          # Contact form components
├── industrias/       # Industries page components
└── nosotros/         # About page components
```

**Pattern:** Each component folder contains `.tsx` + `.module.css` pairs

---

## Dead Code Cleanup — April 19, 2026

**Task:** Find and remove dead code in the frontend.

### Removed Items

| File | Dead Code | Type | Reason |
|------|-----------|------|--------|
| `frontend/src/lib/schemas.ts` | `generateWebPageSchema` function | Unused Export | Function was exported but never imported anywhere in the codebase |
| `frontend/src/components/blog/RichTextRenderer.tsx` | `import styles from './RichTextRenderer.module.css'` | Unused Import | CSS module file doesn't exist AND `styles` variable was never used |
| `frontend/src/app/globals.css` | `.btn-primary:active`, `.btn-secondary:active` | Unused CSS | Classes only defined, never used in any component |
| `frontend/src/app/globals.css` | `.card-interactive`, `.card-interactive:hover` | Unused CSS | Classes only defined, never used in any component |
| `frontend/src/app/globals.css` | `.link-animated`, `.link-animated::after`, `.link-animated:hover::after` | Unused CSS | Classes only defined, never used in any component |

### Verified As Used (Not Removed)
- All FontAwesome icons in `fontawesome.ts` are used dynamically via data files
- All components in `frontend/src/components/` are imported and used
- All exports in `frontend/src/data/*.ts` are used by `api.ts` or components
- All other schema functions in `schemas.ts` are imported and used by page components

### Static Data Fallback Layer
Located at `frontend/src/data/`:
- `home.ts` → HERO_CONTENT, STATS, VIDEO_CONFIG, CLIENTS_CONTENT, SECTION_LABELS
- `services.ts` → SERVICES_CONTENT, SERVICES_NAV
- `cases.ts` → CASES_CONTENT, CASES_PAGE_CONTENT
- `blog.ts` / `blog-data.ts` → BLOG_POSTS, BLOG_STATIC_DATA
- `company.ts` → COMPANY_INFO, SOCIAL_LINKS, NAV_LINKS, FOOTER_LINKS
- `testimonials.ts` → TESTIMONIALS_CONTENT
- `industries.ts` → INDUSTRIES_CONTENT
- `about.ts` → NOSOTROS_CONTENT
- `contact.ts` → CONTACT_CONTENT

### Styling System
- **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`)
- **Theme defined inline** in `globals.css` via `@theme inline { ... }`
- **Brand colors:** `--color-brand-green: #1C7C54`, light/dark variants
- **Font:** Barlow (Google Fonts) loaded via `next/font/google`
- **CSS Modules** for component-specific styles (e.g., `Header.module.css`)
- **Icons:** FontAwesome via npm packages (tree-shaked), configured in `frontend/src/lib/fontawesome.ts`

### Image Handling
`next.config.ts` allows remote images from:
- `images.unsplash.com`
- `s3-godatify-assets-dev.s3.us-east-1.amazonaws.com` (AWS S3)
- `placehold.co`, `ui-avatars.com` (placeholders)
- `localhost:1337` / `127.0.0.1:1337` (local Strapi)

### SEO Configuration
- **Default metadata** in `frontend/src/lib/seo.ts`
- **JSON-LD structured data** in root layout
- **Dynamic sitemap** at `/sitemap.ts` fetches all routes from API
- **Per-page metadata** via `generateMetadata()` functions

### Types
All TypeScript interfaces defined in `frontend/src/types/index.ts`:
- Service, CaseStudy, Industry, Sector, Testimonial
- CompanyInfo, HeroContent, NavLink, SocialLink
- Client, BlogPost, etc.

### Deployment
- **Platform:** Vercel (configured via `vercel.json`)
- **Build:** `npm run build`
- **Output:** `.next/` directory
- **Analytics:** Vercel Analytics + Speed Insights

### Key Patterns
1. **Server Components by default** - pages are async Server Components
2. **'use client' only where needed** - Header.tsx uses client-side state for scroll
3. **Server Actions** for pagination - `'use server'` functions in `/actions/`
4. **Parallel fetching** - `Promise.all()` for multiple API calls
5. **Graceful degradation** - API calls have try/catch with static fallbacks
6. **Path alias** - `@/*` maps to `./src/*`

---

## Session Log

### 2026-04-19 — Vercel Analytics + FontAwesome Migration

**Task:** Add Vercel Analytics and migrate FontAwesome from CDN to npm packages

**Changes:**

#### Part 1: Vercel Analytics
- Installed `@vercel/analytics` and `@vercel/speed-insights`
- Updated `layout.tsx` to include `<Analytics />` and `<SpeedInsights />` components

#### Part 2: FontAwesome Migration
- **Removed:** External CDN link from `layout.tsx`
- **Installed:** `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/react-fontawesome`
- **Created:** `frontend/src/lib/fontawesome.ts` — Library initialization with all needed icons
- **Created:** `frontend/src/components/ui/Icon.tsx` — Reusable Icon component with auto-detection of brand vs solid icons

**Migrated Components (17 files):**
- `app/blog/[slug]/page.tsx`
- `app/industrias/[slug]/page.tsx`
- `components/blog/BlogCard.tsx`
- `components/blog/FeaturedPost.tsx`
- `components/casos/CaseDetail.tsx`
- `components/casos/CasesGrid.tsx`
- `components/contact/ContactHero.tsx`
- `components/contact/Offices.tsx`
- `components/industrias/IndustryShowcase.tsx`
- `components/layout/Footer.tsx`
- `components/nosotros/NosotrosTabs.tsx`
- `components/sections/Hero.tsx`
- `components/sections/Nosotros.tsx`
- `components/sections/Services.tsx`
- `components/sections/Testimonials.tsx`
- `components/servicios/ServiceTechStack.tsx`
- `components/ui/Carousel.tsx`

**Icons Included (Solid):**
arrow-left, arrow-right, chart-line, chart-bar, chart-pie, chevron-left, chevron-right, exclamation-triangle, lightbulb, user-secret, building, external-link-alt, quote-right, map-marker-alt, phone, envelope, server, brain, database, laptop-code, snowflake, search, wind, cube, bolt, stream, mobile-alt, cloud, handshake, check-circle, users

**Icons Included (Brands):**
linkedin-in, facebook-f, instagram, youtube, react, node-js, python, r-project, aws, microsoft

**Benefits:**
- Tree-shaking: Only imports used icons instead of full library
- No FOUC (Flash of Unstyled Content) from CDN loading
- Better bundle control and caching
- Consistent accessibility via Icon component

### Developer Experience
- **Makefile** at `frontend/Makefile` wraps npm scripts for faster CLI workflow
- Run `make` or `make help` to see all available commands
- Color-coded output for better terminal UX
- Key targets: `install`, `dev`, `build`, `start`, `lint`, `clean`

### 2026-04-19 — FontAwesome Icons Not Loading Fix

**Problem:** Console showed `[FontAwesomeIcon] Could not find icon` errors for all icons despite them being imported in `fontawesome.ts`.

**Root Cause:** Server Component / Client Component mismatch in Next.js App Router:
- `fontawesome.ts` was imported in `layout.tsx` (Server Component)
- `library.add()` executed on the server, but the library state doesn't transfer to the client
- `Icon.tsx` (Client Component) tried to use icons on the client where the library was empty

**Fix:**
1. Added `'use client'` directive to `fontawesome.ts` to mark it as a client module
2. Imported `@/lib/fontawesome` directly in `Icon.tsx` BEFORE `FontAwesomeIcon`
3. This ensures the library is initialized on the client side before any icons are rendered

**Key Learning:** In Next.js App Router:
- Side-effect imports in Server Components run only on the server
- For client-side singleton libraries (like FontAwesome's `library`), the initialization must be imported in a Client Component
- Pattern: Import config modules in the component that needs them, not in a parent Server Component
