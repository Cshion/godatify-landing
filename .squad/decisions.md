# Squad Decisions

## Active Decisions

### 2026-05-09: Industry Pages Missing from Sitemap (P0)
**By:** Kane (Content/SEO) | **Priority:** Critical

Industry pages (`/industrias/[slug]`) not included in sitemap.xml. Sitemap correctly generates routes for services, cases, and blog — but omits all 4 industry pages (cervecera, logistica, pesca, agroindustria).

**Impact:** Google cannot discover industry pages from sitemap. Reduces indexation speed for key landing pages.

**Fix:** Add industry routes to `frontend/src/app/sitemap.ts` following existing pattern.

**Status:** 🔴 Pending fix | Filed during SEO audit

---

### 2026-04-26: Database Reset Process Improvement
**By:** Parker (Backend Dev) | **Requested by:** Aaron

Replaced fragile `make reset-db` with single TypeScript script (`scripts/reset.ts`):
- Uses Strapi's programmatic API — no external `psql` needed
- Truncates via Knex, seeds in same process — no timing issues  
- Cross-platform — no hardcoded paths
- Commands: `make reset-db` (full) or `make reset-db-no-mock` (master only)

---

### 2026-04-26: Single Types Architecture — cases-page & blog-page Added
**By:** Ripley (Lead)

- ✅ `industries-page` pattern correct (page chrome vs data entries)
- ✅ Added `cases-page` Single Type (was hardcoded in frontend)
- ✅ Added `blog-page` Single Type (was hardcoded in frontend)
- ⚪ `services-page` not needed (no listing page exists)

---

### 2026-04-22: P2 Color Token Migration
**By:** Dallas (Frontend Dev) | **Verified by:** Lambert (Tester)

Replaced all hard-coded white colors with `var(--color-white)` token.
35 replacements across 14 component CSS files. Only `globals.css` token definition remains.

---

### 2026-04-22: P1 Motion Fixes — bounce → subtlePulse
**By:** Dallas (Frontend Dev) | **Reviewed by:** Lambert (Tester)

Replaced dated bounce animation with refined subtlePulse using ease-out-quart.
Added `prefers-reduced-motion` support for WCAG 2.3.3 compliance.

---

### 2026-05-03: Sprint Kickoff — Services Section Timeline Redesign (OPP 1 + OPP 2)
**By:** Coordinator (Squad) | **Requested by:** Aaron
**Team:** Dallas (Frontend), Brett (Designer), Lambert (Tester), Ripley (Lead)
**Phase:** Pre-launch development (no prod constraints)

**What:** Redesign Services section from 2-column grid → "Data Transformation Journey" timeline:
- **OPP 2 (1 day):** Elevate featured service visually (teal border 2px, gradient, larger icon, bold title)
- **OPP 1 (2-3 days):** Restructure layout as horizontal (desktop) / vertical (mobile) timeline showing 5 phases

**Phase mapping:** 
1. Data Engineering (ingesta)
2. Big Data Management (gobernanza)
3. Business Analytics (análisis)
4. Business Intelligence (visualización)
5. Digital Platform (acción)

**Why:** Current section is generic (looks like any consultant). Timeline communicates "deep data transformation expertise" + CTO-friendly language (pipeline/phases). Expected impact: 50% improvement in "credibility" metric.

**Deliverables:**
- Design specs (Brett) + mockup
- Updated Services.tsx + Services.module.css (Dallas)
- Responsive testing desktop/table/mobile (Lambert)
- Merged & live before EOW

**Status:** ✅ Approved | Specs queued in `.squad/decisions/inbox/` | Team ready to kickoff

**Key decisions:**
- ✅ No backend changes (5 services already in correct order)
- ✅ Component stays backward compatible (same props)
- ✅ Brand teal only (#135C51), no new colors
- ⚠️ Pending: Connector visual (CSS arrows vs SVG curves)?  
- ⚠️ Pending: Click behavior on phase cards?

**Sprint specs:** `.squad/decisions/inbox/services-sprint-design-specs.md`  
**Implementation brief:** `.squad/decisions/inbox/sprint-services-brief.md`  
**Timeline:** 3-5 days starting Day 1 (design finalization)

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
