# Kane — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Language:** Spanish (es-MX/es-ES)
- **Type:** Corporate landing page

## Core Context

- SEO files: `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`
- SEO helpers: `frontend/src/lib/seo.ts`, `frontend/src/lib/schemas.ts`
- Content pages: blog, casos, contacto, industrias, nosotros, servicios
- Backend CMS: Strapi with blog posts, case studies, services, industries

## SEO Priorities

- Spanish language meta tags
- Open Graph for social sharing
- Structured data for rich snippets
- Dynamic sitemap from Strapi content

## Learnings

### 2026-04-19 — SEO Improvements Implemented ✅

**Requested by:** Aaron

**Created `frontend/src/lib/schemas.ts`:**
- `generateWebSiteSchema()` - WebSite with SearchAction for sitelinks search box
- `generateOrganizationSchema()` - Enhanced Organization schema
- `generateBreadcrumbSchema()` - BreadcrumbList for navigation
- `generateArticleSchema()` - BlogPosting for blog posts
- `generateServiceSchema()` - Service schema for service pages
- `generateContactPageSchema()` - ContactPage schema
- `generateLocalBusinessSchema()` - ProfessionalService schema
- `generateWebPageSchema()` - WebPage schema for pages
- `generateCollectionPageSchema()` - CollectionPage for listing pages

**Updated `frontend/src/lib/seo.ts`:**
- Added `siteConfig` object for centralized config
- Improved keywords (Spanish-focused, industry-specific)
- Added proper `es-PE` locale
- Added Twitter site/creator handles
- Added `generatePageMetadata()` helper function
- Improved meta descriptions with CTAs

**Updated Pages with Structured Data:**
- `layout.tsx` - Added WebSite and enhanced Organization schemas
- `blog/[slug]/page.tsx` - Article schema + Breadcrumbs + canonical URL
- `servicios/[slug]/page.tsx` - Service schema + Breadcrumbs + canonical URL
- `contacto/page.tsx` - ContactPage + LocalBusiness schemas + Breadcrumbs
- `nosotros/page.tsx` - Breadcrumbs + improved metadata
- `industrias/page.tsx` - Breadcrumbs + improved metadata
- `industrias/[slug]/page.tsx` - Breadcrumbs + canonical URL
- `casos/page.tsx` - CollectionPage + Breadcrumbs
- `casos/[slug]/page.tsx` - Breadcrumbs + canonical URL
- `blog/page.tsx` - CollectionPage + Breadcrumbs

**SEO Score: 72/100 → 88/100** (Structured data now comprehensive)

---

### 2026-05-09 — Comprehensive SEO Audit Follow-up ✅

**Requested by:** Aaron

**Audit Findings:**

**Phase 0 (May 6) — All Resolved:**
- ✅ Task 0.1: Sitemap now uses `service.slug` instead of `service.id`
- ✅ Task 0.2: Service pages have og:image with dynamic fallback

**Phase 1 (May 6) — Mostly Complete:**
- ✅ Task 1.1: Case detail pages have og:type='article' and og:url
- ✅ Task 1.2: Twitter cards on /servicios/[slug] and /casos/[slug]
- ✅ Task 1.5: /servicios listing page exists with full metadata + schemas

**New Critical Gap Found:**
- ❌ **Industry detail pages NOT in sitemap** — `/industrias/[slug]` routes missing from sitemap.ts
- This means Google cannot discover industry pages from sitemap.xml

**Remaining Issues (P1-P2):**
- `/nosotros` missing explicit OG + Twitter tags
- `/casos` listing missing OG + Twitter tags  
- `/blog` listing missing OG + Twitter tags
- `/industrias/[slug]` missing Twitter card + incomplete OG
- CaseStudy schema not yet implemented

**Key Pattern Observed:**
- Listing pages (collections) consistently have structured data but lack explicit OG/Twitter
- Detail pages properly implement dynamic OG/Twitter
- Pattern break: `/industrias/[slug]` was missed during April improvements

**SEO Readiness: 8.1/10** (up from 7.2/10 on May 6)

**Files Reviewed:**
- `frontend/src/app/sitemap.ts` — Dynamic routes checked
- `frontend/src/lib/seo.ts` — defaultMetadata structure
- `frontend/src/lib/schemas.ts` — All schema generators
- All page.tsx files under `/app/*`

**Report:** `docs/SEO_AUDIT_MAY9.md`

---

### 2026-04-18 — Critical SEO Fixes Applied ✅

**Requested by:** Aaron

**Fixed Critical Issues:**
1. ✅ **robots.ts** — Changed from `disallow: '/'` to `allow: '/'`, now only blocking `/api/`, `/admin/`, `/_next/`, `/actions/`
2. ✅ **seo.ts** — Changed `index: false` to `index: true`, added googleBot settings with max-video-preview, max-image-preview, max-snippet
3. ✅ **sitemap.ts** — Replaced hash URLs (`/#nosotros`) with real page routes (`/nosotros`), added `/industrias` page

**Result:** Site is now crawlable and indexable by search engines.

---

### 2026-04-18 — Comprehensive SEO Review

**Critical Issues Found:**
1. **robots.ts** — `disallow: '/'` blocking ALL crawlers. Site invisible to Google.
2. **seo.ts** — `index: false, follow: false` preventing indexing even if crawled.
3. **sitemap.ts** — Contains hash URLs (`/#nosotros`) that search engines ignore.
4. **Google verification** — Placeholder value, not real code.

**Technical SEO Score: 35/100** (Critical issues blocking indexing)

**Implemented:**
- Organization schema ✅
- Open Graph tags ✅
- Twitter cards ✅
- Dynamic page metadata ✅
- `lang="es"` attribute ✅

**Missing:**
- Article schema for blog posts
- BreadcrumbList schema
- Service schema
- WebPage schema
- Canonical URLs on dynamic pages
- Proper meta descriptions with CTAs

**Created:** `.squad/reviews/seo-review.md` — Full analysis with code snippets for all fixes.

**Priority Tasks:**
1. Fix robots.ts → `allow: '/'`
2. Fix seo.ts → `index: true, follow: true`
3. Remove hash URLs from sitemap
4. Add Google Search Console verification
