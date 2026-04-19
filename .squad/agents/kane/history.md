# Kane — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Language:** Spanish (es-MX/es-ES)
- **Type:** Corporate landing page

## Core Context

- SEO files: `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`
- SEO helpers: `frontend/src/lib/seo.ts`
- Content pages: blog, casos, contacto, industrias, nosotros, servicios
- Backend CMS: Strapi with blog posts, case studies, services, industries

## SEO Priorities

- Spanish language meta tags
- Open Graph for social sharing
- Structured data for rich snippets
- Dynamic sitemap from Strapi content

## Learnings

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
