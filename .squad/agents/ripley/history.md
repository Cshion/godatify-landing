# Ripley — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Stack:** Next.js 16 + React 19 + TailwindCSS 4 (frontend) / Strapi 5 + GraphQL + PostgreSQL (backend)
- **Language:** Spanish landing page

## Core Context

- Monorepo structure: `frontend/` (Next.js) and `backend/` (Strapi)
- Pages: home, blog, casos, contacto, industrias, nosotros, servicios
- Content types: blog-post, case-study, client, industry, service, testimonial, social-link

## Learnings

### 2026-04-18 — Exploración de Arquitectura

**Hallazgos clave:**

1. **Arquitectura Headless CMS** — Frontend desacoplado de backend via REST/GraphQL. Strapi sirve contenido, Next.js lo renderiza.

2. **Fallback Data Pattern** — El frontend tiene datos estáticos en `src/data/` que sirven como fallback si Strapi no responde. Útil para desarrollo independiente.

3. **Content Type Structure:**
   - **Collection Types:** service, case-study, blog-post, industry, sector, client, testimonial, author, social-link
   - **Single Types:** company-info, home-page, about-page, contact-page, industries-page
   - **Relaciones:** Sector → Industry → Case Study ← Client; Author → Blog Post

4. **Database Strategy:**
   - Desarrollo: SQLite (zero config)
   - Producción: PostgreSQL
   - Configuración automática via `DATABASE_CLIENT` env var

5. **Media Storage:**
   - Desarrollo: local (`public/uploads/`)
   - Producción: AWS S3 (configurado en `config/plugins.ts`)
   - Toggle via `DISABLE_S3=true` en desarrollo

6. **API Library Pattern** (`frontend/src/lib/api.ts`)
   - Centraliza todas las llamadas a Strapi
   - Parallel fetching con `Promise.all()` para performance
   - Fallback a datos estáticos en caso de error

7. **Sin Docker** — El proyecto no usa Docker. Setup manual con Node.js >= 20.

8. **Seed Data** — Datos de prueba disponibles en `backend/seed-data/` pero sin script automatizado de importación.

### 2026-04-26 — Single Types Architecture Review

**Pattern Confirmed:** `{page}-page` (Single Type) + `{entity}` (Collection Type) is the correct CMS pattern for listing pages. Example: `industries-page` holds hero content, `industry` holds data entries.

**Hardcoded Content Found:**
- `/casos` hero: `frontend/src/data/cases.ts` → `CASES_PAGE_CONTENT.hero`
- `/blog` hero: `frontend/src/data/blog-data.ts` → `BLOG_STATIC_DATA.hero`

**Recommendation:** Add `cases-page` and `blog-page` Single Types to make this content CMS-editable. No `services-page` needed (no listing page exists).

**Áreas de mejora identificadas:**
- [ ] Implementar ISR o cache tags para producción (actualmente `cache: 'no-store'`)
- [ ] Crear script de seed automatizado para desarrollo
- [ ] Documentar proceso de migración de base de datos

<!-- Append new learnings here -->
