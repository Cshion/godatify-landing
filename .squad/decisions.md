# Squad Decisions

## Active Decisions

### 2026-05-09: Social SEO Focus — LinkedIn, Not Twitter
**By:** Aaron (via Coordinator)

Twitter cards are NOT needed. Focus social SEO on LinkedIn.

**Why:** LinkedIn is the target social network for this B2B landing page.

**Implications:**
- Twitter card metadata (`twitter:*`) → Skip
- Open Graph tags (`og:*`) → Critical for LinkedIn previews
- Validate with LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/inspect/

---

### 2026-05-09: Industry Pages Missing from Sitemap (P0)
**By:** Kane (Content/SEO) | **Priority:** Critical

Industry pages (`/industrias/[slug]`) not included in sitemap.xml. Sitemap correctly generates routes for services, cases, and blog — but omits all 4 industry pages (cervecera, logistica, pesca, agroindustria).

**Impact:** Google cannot discover industry pages from sitemap. Reduces indexation speed for key landing pages.

**Fix:** Add industry routes to `frontend/src/app/sitemap.ts` following existing pattern.

**Status:** ✅ Fixed by Dallas (2026-05-09) — Added industry routes to sitemap

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

### 2026-05-09: AWS Infrastructure Architecture Decisions
**By:** Jonesy (DevOps) | **Reviewed by:** Ripley (Lead)

Key infrastructure decisions for EC2 deployment:

**Systemd over PM2:**
- Native to Amazon Linux 2023, no additional dependency
- Better journald integration, proper cgroup limits
- Security sandboxing (ProtectSystem, NoNewPrivileges)
- Saves ~100MB memory overhead

**Unix Domain Socket for PostgreSQL:**
- ~10% lower latency (no TCP overhead)
- No port exposure, simpler connection string

**Separate EBS Data Volume (20GB gp3):**
- Independent backup schedule
- Easier disaster recovery (attach to new instance)

**ZRAM over EBS Swap:**
- No IOPS consumed, lower latency
- ~2-3x effective memory with zstd compression

**Glacier Instant Retrieval for S3 Backups:**
- 68% cheaper than S3 Standard
- Millisecond retrieval when needed

**Files:** `docs/deployment/INFRASTRUCTURE.md`, `docs/deployment/RUNBOOK.md`, `scripts/infra/*`

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
