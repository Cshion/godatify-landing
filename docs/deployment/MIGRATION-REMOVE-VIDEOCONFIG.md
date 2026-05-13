# Production Migration Plan: Remove videoConfig

**Date:** 2026-05-12  
**Authors:** Ripley (Lead), Jonesy (DevOps)  
**Status:** Ready for review  
**Risk Level:** Low (backward-compatible approach)

---

## Executive Summary

This plan removes the `videoConfig` field from the home page in favor of `sectionImageUrl`. The migration uses a **contract-safe, backward-compatible** rollout that ensures zero downtime.

### Key Finding: Already Safe

**The frontend already handles `videoConfig` being null/empty.** See [Nosotros.tsx](../../frontend/src/components/sections/Nosotros.tsx#L20):

```tsx
const hasImage = Boolean(sectionImageUrl);
const hasVideo = Boolean(videoConfig?.url);

// Image takes priority over video - already implemented
{hasImage ? (
  // renders image
) : videoConfig && (
  // renders video (fallback)
)}
```

This means the removal is **lower risk than initially assessed**.

---

## Current State Analysis

### What Exists

| Layer | Field | Status | Location |
|-------|-------|--------|----------|
| Backend Schema | `videoConfig` (JSON) | Active | `backend/src/api/home-page/content-types/home-page/schema.json` |
| Backend Schema | `sectionImageUrl` (string) | Active | Same file |
| Seed Data | `videoConfig` object | Has dummy data | `backend/seed-data/master/home.json` |
| Seed Data | `sectionImageUrl` | Has `.mp4` path | Same file |
| Frontend Types | `VideoConfig` interface | Exported | `frontend/src/types/index.ts` |
| Frontend API | `videoConfig` in response | Returns from Strapi | `frontend/src/lib/api.ts` |
| Frontend UI | `videoConfig` prop | Used in Nosotros | `frontend/src/components/sections/Nosotros.tsx` |
| Database | `video_config` column | **Unknown** | `home_pages` table in PostgreSQL |

### Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `backend/src/api/home-page/content-types/home-page/schema.json` | Remove `videoConfig` attribute | P1 |
| `backend/seed-data/master/home.json` | Remove `videoConfig` object | P1 |
| `frontend/src/types/index.ts` | Remove `VideoConfig` interface | P2 |
| `frontend/src/lib/api.ts` | Remove `videoConfig` handling | P2 |
| `frontend/src/components/sections/Nosotros.tsx` | Simplify props | P2 |
| `frontend/src/app/page.tsx` | Remove `videoConfig` prop | P2 |
| `frontend/src/app/nosotros/page.tsx` | Remove `videoConfig` usage | P2 |
| Database (optional) | Drop `video_config` column | P3 |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API contract break | Low | Medium | Frontend already handles null; deploy frontend first |
| Database column orphan | None | Low | Column can stay indefinitely (harmless) |
| Rollback needed | Low | Low | Git revert + redeploy; no data loss possible |
| Cache invalidation | Medium | Low | Vercel ISR revalidates on deploy |

**Overall Risk: LOW** — This is a removal of unused code, not a behavior change.

---

## Deployment Strategy

### Approach: Frontend-First, Backend-Second

The safest order is:

```
1. Deploy Frontend (tolerant of both states)
   └── Already handles videoConfig: null
   
2. Deploy Backend (removes field from schema)
   └── API stops returning videoConfig
   
3. Database Cleanup (optional, non-urgent)
   └── Column can stay or be dropped later
```

This order ensures:
- ✅ Frontend never receives unexpected data
- ✅ No moment where frontend expects data backend doesn't send
- ✅ Rollback at any step is safe

---

## Step-by-Step Deployment Plan

### Phase 1: Pre-Deployment Verification

**On your local machine:**

```bash
# 1. Pull latest main
git checkout main && git pull

# 2. Verify production state - check if videoConfig is being used
curl -s "https://api.godatify.com/api/home-page" | jq '.data.videoConfig'
# Expected: { "url": "...", "title": "...", "caption": "..." } or null

# 3. Verify sectionImageUrl is set
curl -s "https://api.godatify.com/api/home-page" | jq '.data.sectionImageUrl'
# Expected: "/images/nosotros-hero.mp4" or similar
```

**Decision point:** If `sectionImageUrl` is null in production, seed the value BEFORE removing `videoConfig`.

### Phase 2: Frontend Deployment (Vercel)

**Changes to make:**

1. **Clean up types** — Remove `VideoConfig` interface
2. **Clean up api.ts** — Remove `videoConfig` handling (return empty object for backward compat during transition)
3. **Clean up components** — Remove `videoConfig` props from Nosotros

**Push and deploy:**

```bash
# Create branch
git checkout -b feat/remove-video-config

# Make changes (see implementation section below)
# ...

# Push to trigger Vercel preview
git push -u origin feat/remove-video-config

# Verify preview deployment works
# https://godatify-landing-<hash>.vercel.app
```

**Verification checklist:**
- [ ] Homepage loads without errors
- [ ] Nosotros section shows image (not iframe)
- [ ] /nosotros page works
- [ ] Browser console has no errors
- [ ] No 404s for missing assets

**If preview passes:**

```bash
# Merge to main (triggers Vercel production deploy)
git checkout main
git merge feat/remove-video-config
git push
```

**Post-deploy verification:**
- [ ] https://godatify.com loads correctly
- [ ] Nosotros section displays properly
- [ ] Check Vercel deployment logs for errors

### Phase 3: Backend Deployment (EC2)

**Changes to make:**

1. **Remove from schema.json** — Delete `videoConfig` attribute
2. **Remove from seed data** — Delete `videoConfig` from home.json

**Deploy to production:**

```bash
# SSH to server not needed - use local build strategy
cd backend

# Build locally
npm run build

# Deploy (builds, syncs, reloads PM2)
make deploy

# Or step by step:
make deploy-dry  # Preview what will sync
make deploy      # Execute deployment
```

**Verification:**

```bash
# Check API response no longer includes videoConfig
curl -s "https://api.godatify.com/api/home-page" | jq '.data | keys'
# Should NOT include "videoConfig"

# Check Strapi is healthy
curl -s "https://api.godatify.com/_health"
# Expected: HTTP 204

# Check PM2 status
ssh godatify-backend "pm2 status"
```

### Phase 4: Database Cleanup (Optional)

**Recommendation: Skip this phase initially.** 

The `video_config` column is harmless:
- Takes negligible storage (JSON column, single row)
- Doesn't affect queries
- Doesn't appear in API responses once schema is removed

**If you want to clean it up later:**

```bash
# SSH to EC2
ssh godatify-backend

# Connect to PostgreSQL
sudo -u postgres psql -d strapi

# Check current state
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'home_pages';

# Drop column (ONLY after confirming frontend/backend work)
ALTER TABLE home_pages DROP COLUMN IF EXISTS video_config;

# Verify
\d home_pages
```

**Migration file approach (better for tracking):**

Create `backend/database/migrations/2026.05.13T00.00.00.remove-video-config.ts`:

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('home_pages', 'video_config');
  
  if (hasColumn) {
    await knex.schema.alterTable('home_pages', (table) => {
      table.dropColumn('video_config');
    });
    console.log('✅ Migration: Dropped video_config column from home_pages');
  } else {
    console.log('ℹ️ Migration: video_config column already gone, skipping');
  }
}

// No down() - Strapi 5 doesn't support it
// Manual restore: Run the seed script
```

---

## Rollback Procedures

### If Frontend Deploy Fails

```bash
# Vercel automatic rollback
# Go to: https://vercel.com/[team]/godatify-landing/deployments
# Click on previous deployment → "Promote to Production"

# Or via CLI
vercel rollback --scope=[team]
```

### If Backend Deploy Fails

```bash
# SSH to server
ssh godatify-backend

# Check what's wrong
pm2 logs strapi --lines 50

# If schema issue, restore from git
cd /var/www/godatify/backend
git checkout HEAD~1 -- src/api/home-page/content-types/home-page/schema.json
pm2 reload strapi

# If npm issue, restore node_modules
npm ci --omit=dev
pm2 reload strapi
```

### If Database Migration Fails

```bash
# The column drop is the LAST step and reversible
# Strapi will recreate the column on next schema sync if needed

# Manual restore (if needed):
sudo -u postgres psql -d strapi -c "
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS video_config JSONB;
"
```

---

## Implementation Checklist

### Pre-Flight
- [ ] Verify `sectionImageUrl` is set in production database
- [ ] Take database backup: `ssh godatify-backend "make backup"` 
- [ ] Note current Vercel deployment hash for rollback
- [ ] Confirm it's not peak traffic time

### Frontend Changes
- [ ] Remove `VideoConfig` interface from `types/index.ts`
- [ ] Remove `videoConfig` handling from `api.ts`
- [ ] Remove `videoConfig` prop from `Nosotros.tsx`
- [ ] Remove `videoConfig` from `page.tsx` (home)
- [ ] Remove `videoConfig` from `nosotros/page.tsx`
- [ ] Build locally: `cd frontend && npm run build`
- [ ] Run type check: `npm run type-check`
- [ ] Deploy to Vercel preview
- [ ] Verify preview deployment
- [ ] Merge to main

### Backend Changes
- [ ] Remove `videoConfig` from `schema.json`
- [ ] Remove `videoConfig` from `home.json` seed data
- [ ] Build locally: `cd backend && npm run build`
- [ ] Deploy: `make deploy`
- [ ] Verify API response
- [ ] Verify Strapi admin panel

### Post-Deployment
- [ ] Monitor Vercel logs for errors (15 min)
- [ ] Monitor PM2 logs for errors (15 min)
- [ ] Test full user journey on production
- [ ] Update any internal documentation

---

## FAQ

**Q: Why not do backend first?**  
A: If we remove `videoConfig` from schema before frontend is ready, the API would stop returning it. If old frontend code expects it (even as null), it could error. Frontend-first is safer.

**Q: Will the database column cause issues?**  
A: No. Strapi only includes fields defined in schema.json in API responses. The column will simply be ignored.

**Q: What if production has different data than local?**  
A: Run the pre-deployment verification to check. The migration works regardless of current values because we're only removing a field.

**Q: Do we need downtime?**  
A: No. Both Vercel and PM2 do zero-downtime deployments.

---

## Sign-Off

| Role | Name | Status |
|------|------|--------|
| Lead | Ripley | ✅ Approved |
| DevOps | Jonesy | ✅ Approved |
| Product Owner | Aaron | ⏳ Pending |

---

*Document generated: 2026-05-12*  
*Last updated: 2026-05-12*
