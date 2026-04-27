# Squad Decisions

## Active Decisions

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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
