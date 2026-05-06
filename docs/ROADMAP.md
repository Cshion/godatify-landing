# Roadmap

## Status: Production-Ready — May 2026

The Datify landing platform is complete and production-ready. All core pages, CMS integration, SEO, and performance optimizations are in place.

---

## Completed Features

### Foundation
- [x] Next.js 16 App Router setup with TypeScript
- [x] Tailwind CSS v4 integration
- [x] Global layout: Header, Footer, Navigation
- [x] Strapi 5 CMS backend on EC2 with PostgreSQL
- [x] Typed API client (`lib/api.ts`) with `qs` query building
- [x] Vercel deployment configuration (`vercel.json`)
- [x] Cloudflare CDN in front of Vercel

### Pages
- [x] Home page (`/`) — Hero, Nosotros, Services, Cases, Testimonials, Clients sections
- [x] Nosotros (`/nosotros`) — About page with team and stats
- [x] Servicios (`/servicios`) — Service listing page
- [x] Servicios detail (`/servicios/[slug]`) — Individual service pages
- [x] Casos (`/casos`) — Case studies listing
- [x] Casos detail (`/casos/[slug]`) — Individual case study pages
- [x] Industrias (`/industrias`) — Industry verticals overview
- [x] Industrias detail (`/industrias/[slug]`) — Per-industry page
- [x] Blog (`/blog`) — Article listing
- [x] Blog detail (`/blog/[slug]`) — Individual post with Strapi Blocks renderer
- [x] Contacto (`/contacto`) — Contact form with server action validation

### CMS Content Types
- [x] All 17 content types defined and seeded
- [x] Master seed data (canonical): company info, pages, industries, sectors, services, social links
- [x] Mock seed data (dev): authors, blog posts, cases, clients, testimonials
- [x] Auto-bootstrap on startup with permission setup
- [x] Blog post `tags` field migrated to `json` type

### Components
- [x] **PartnerLogos** — Infinite CSS marquee carousel (AWS, Azure, Google Cloud, Power BI, Databricks)
  - Integrated on: Home, Nosotros, Servicios detail pages
- [x] ScrollReveal animations
- [x] Testimonials carousel
- [x] Client logo grid
- [x] Rich text blog content renderer

### Performance & SEO
- [x] Security headers (CSP, X-Frame-Options, etc.) in `vercel.json`
- [x] CDN cache rules for static assets (1-year for fingerprinted, 1-day for images)
- [x] OG image configuration for social sharing
- [x] `robots.ts` and `sitemap.ts` dynamic generation
- [x] Vercel Analytics + Speed Insights
- [x] Multi-region deployment (`iad1`, `sfo1`)

### Infrastructure
- [x] EC2 deployment with PM2 process management
- [x] Cloudflare DNS, CDN, and DDoS protection
- [x] AWS S3 for media uploads (Strapi provider)
- [x] Deployment runbook (`docs/DEPLOYMENT.md`)

---

## Known Issues

None blocking production. Only cosmetic CSS refinements may be identified post-launch.

---

## Future Enhancements

> These are ideas for post-launch iterations — not committed or scoped.

- [ ] Spanish-language search (Algolia or Strapi search plugin)
- [ ] Case study filter by industry on `/casos`
- [ ] Newsletter sign-up integration
- [ ] Multi-language support (es / en)
- [ ] Strapi ISR integration for on-demand revalidation
- [ ] Admin content workflow: draft preview links
- [ ] Performance: convert partner logos to Next.js `<Image>` with local SVG handling
