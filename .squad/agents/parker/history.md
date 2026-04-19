# Parker — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Stack:** Strapi 5.31.3 + GraphQL + PostgreSQL + AWS S3
- **Language:** Spanish landing page backend

## Core Context

- Backend at `backend/`
- Content types at `backend/src/api/` (blog-post, case-study, client, industry, sector, service, social-link, testimonial)
- Configuration at `backend/config/` (admin, api, database, middlewares, plugins, server)
- Seed data at `backend/seed-data/master/` and `backend/seed-data/mock/`
- Generated types at `backend/types/generated/`

## Learnings

### NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` / `develop` | `strapi develop` | Start dev server with hot-reload |
| `start` | `strapi start` | Production server (no hot-reload) |
| `build` | `strapi build` | Build admin panel |
| `console` | `strapi console` | Interactive Strapi REPL |
| `deploy` | `strapi deploy` | Deploy to Strapi Cloud |
| `upgrade` | `npx @strapi/upgrade latest` | Upgrade Strapi version |
| `upgrade:dry` | `npx @strapi/upgrade latest --dry` | Preview upgrade changes |

### Starting the Server

```bash
cd backend
npm install         # First time setup
npm run dev         # Development (with auto-reload)
npm run start       # Production
```

Server runs at `http://localhost:1337` by default.
- Admin panel: `http://localhost:1337/admin`
- GraphQL playground: `http://localhost:1337/graphql`
- REST API: `http://localhost:1337/api/{content-type}`

### Content Types (14 total)

#### Single Types (Pages)
| Type | UID | Draft/Publish | Description |
|------|-----|---------------|-------------|
| About Page | `api::about-page.about-page` | No | Hero, mission, vision, culture, values |
| Contact Page | `api::contact-page.contact-page` | No | Form labels, offices |
| Home Page | `api::home-page.home-page` | No | Hero, stats, video, client carousel |
| Industries Page | `api::industries-page.industries-page` | No | Hero for industries landing |
| Company Info | `api::company-info.company-info` | No | Company name, logo, email, website |

#### Collection Types
| Type | UID | Draft/Publish | Key Fields |
|------|-----|---------------|------------|
| Author | `api::author.author` | Yes | name*, bio, avatar, linkedin |
| Blog Post | `api::blog-post.blog-post` | Yes | title*, slug*, content (Blocks), author (→Author), tags |
| Case Study | `api::case-study.case-study` | Yes | title*, slug, challenge, solution, results (JSON), techStack, industry (→Industry)*, client (→Client), services (→Service[]), testimonial (→Testimonial) |
| Client | `api::client.client` | Yes | name*, logo, website |
| Industry | `api::industry.industry` | Yes | title*, slug, description, sector (→Sector), stats, projects |
| Sector | `api::sector.sector` | Yes | title*, slug, description, industries (→Industry[]) |
| Service | `api::service.service` | Yes | title*, slug*, subtitle, description, icon, features/methodology/techStack (JSON), phrases |
| Social Link | `api::social-link.social-link` | No | label*, slug*, url*, icon |
| Testimonial | `api::testimonial.testimonial` | Yes | quote*, author, role, authorImage, linkedIn |

### Key Relationships

```
Sector → Industry → Case Study ← Client
                  ↓
            Service (M:M)
                  ↓
            Testimonial (1:1)

Author → Blog Post
Home Page → Client[]
```

### Database Configuration (`config/database.ts`)

Supports **SQLite**, **PostgreSQL**, and **MySQL** via `DATABASE_CLIENT` env var.

**Default (dev):** SQLite at `.tmp/data.db`

**PostgreSQL config:**
```
DATABASE_URL=             # Connection string (preferred)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
DATABASE_SCHEMA=public
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=50
```

### S3 Configuration (`config/plugins.ts`)

AWS S3 upload enabled **only in production** (DISABLE_S3=false).
Default: Local uploads in dev mode.

**Required env vars for S3:**
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET=
DISABLE_S3=false  # Set false to enable S3
```

CSP rules in `config/middlewares.ts` whitelist S3 bucket domains for img/media.

### GraphQL Configuration

**Endpoint:** `http://localhost:1337/graphql`

**Limits (config/plugins.ts):**
- `defaultLimit`: 100
- `maxLimit`: 200  
- `depthLimit`: 1

**REST API limits (config/api.ts):**
- `defaultLimit`: 25
- `maxLimit`: 100
- `withCount`: true

### Environment Variables (Complete List)

**Core:**
```
HOST=0.0.0.0
PORT=1337
NODE_ENV=development|production
APP_KEYS="key1,key2"
```

**Security:**
```
ADMIN_JWT_SECRET=
API_TOKEN_SALT=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=
```

**Database:** (see Database Configuration above)

**AWS S3:** (see S3 Configuration above)

### Seed Data Structure

**Master Data** (`seed-data/master/`) — Always seeded:
- `services.json` - 4+ services with features, methodology, techStack
- `social-links.json` - Social media links
- `company.json` - Company info single type
- `clients.json` - Client logos
- `authors.json` - Blog authors
- `sectors.json` - Industry sectors (consumo-masivo, logistica-transporte, agro-pesca)
- `industries.json` - Industries with page config + industries array
- `testimonials.json` - Client testimonials
- `home.json` - Home page content (hero, stats, video, carousel)
- `about.json` - About page content
- `contact.json` - Contact page content

**Mock Data** (`seed-data/mock/`) — Dev only:
- `blog-posts.json` - Sample blog articles
- `cases.json` - Sample case studies

**Custom Logic (`src/index.ts` → `src/bootstrap/`):**

**REFACTORED 2026-04-19:** Seed logic extracted into modular bootstrap system.

**Module Structure:**
```
backend/src/bootstrap/
├── index.ts           # Orchestrator - runs all bootstrap steps
├── config.ts          # Shared configuration maps (MEDIA_FIELDS_MAP, etc.)
├── utils.ts           # seedCollection, seedSingle utilities
├── lifecycle-hooks.ts # Media URL sync, relation denormalization, reverse sync
├── permissions.ts     # Public role permissions (ALWAYS)
├── master-data.ts     # Foundational seed data (NON-PRODUCTION)
├── mock-data.ts       # Test/demo content (DEVELOPMENT ONLY)
├── sync.ts            # Backfill sync operations (ALWAYS)
├── indexes.ts         # Database index optimization (ALWAYS)
└── repairs.ts         # Data corruption fixes (ALWAYS)
```

**Environment Behavior:**
| Module | Production | Staging | Development |
|--------|------------|---------|-------------|
| Lifecycle hooks | ✅ | ✅ | ✅ |
| Backfill sync | ✅ | ✅ | ✅ |
| Permissions | ✅ | ✅ | ✅ |
| Indexes | ✅ | ✅ | ✅ |
| Repairs | ✅ | ✅ | ✅ |
| Master data | ❌ | ✅ | ✅ |
| Mock data | ❌ | ❌ | ✅ |

**1. Media URL Auto-Sync (Lifecycle Hook):**
- Automatically populates `*Url` fields from uploaded media
- Content types: case-study, industry, testimonial, client, service, company-info

**2. Relation Denormalization (Forward Sync):**
- Case studies auto-populate: `clientName`, `clientLogoUrl`, `clientWebsite`, `industryName`, `testimonialQuote`, `testimonialAuthor`, `testimonialRole`, etc.

**3. Reverse Sync:**
- When Client/Industry/Testimonial updates, propagates changes to related Case Studies

**4. Auto-Seeding on Bootstrap:**
- Master data: Always seeded on startup (upsert strategy)
- Mock data: Only seeded when `NODE_ENV=development`

**5. Auto-Permissions:**
- Configures Public role with read access to all content types

### Controllers & Services

All use **factories (default Strapi core)**:
```typescript
// controllers/case-study.ts
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::case-study.case-study');

// services/case-study.ts
export default factories.createCoreService('api::case-study.case-study');

// routes/case-study.ts
export default factories.createCoreRouter('api::case-study.case-study');
```

No custom controller/service logic beyond the lifecycle hooks in `src/index.ts`.

### Dependencies

**Runtime:**
- `@strapi/strapi@5.31.3` - Core
- `@strapi/plugin-graphql@5.31.3` - GraphQL API
- `@strapi/plugin-users-permissions@5.31.3` - Auth
- `@strapi/provider-upload-aws-s3@5.31.3` - S3 uploads
- `pg@8.16.3` - PostgreSQL client
- `better-sqlite3@12.4.1` - SQLite (dev)
- `sharp@0.34.5` - Image processing
- `axios@1.13.2`, `form-data@4.0.5`, `qs@6.14.0` - HTTP utilities

**DevDependencies:**
- `typescript@5`, `@types/node@20`, `@types/react@18`

### Node Version

Required: `>=20.0.0 <=24.x.x`

---
*Last updated: 2026-04-18 by Parker (Backend Dev)*

### 2026-04-18 — Seed Data Validation Fix

**Issue:** `YupValidationError: 3 errors occurred` when seeding mock data.

**Root Cause:** Case studies in `seed-data/mock/cases.json` had **invalid industry values** that didn't match any industry in `seed-data/master/industries.json`.

**Valid Industry Values:**
| Slug | Title |
|------|-------|
| `cervecera` | Industria Cervecera |
| `logistica` | Industria Logística |
| `agricola` | Industria Agrícola |
| `pesquera` | Industria Pesquera |

**Cases Fixed:**

1. **`kpis-npo`**: Changed `industry: "Business Analytics"` → `"Industria Cervecera"`
2. **`optimizacion-riego`**: Changed `industry: "Retail"` → `"Industria Agrícola"` + added missing `description`, `challenge`, `solution` fields
3. **`optimizacion-logistica`**: Changed `industry: "Logística"` → `"Industria Logística"` for consistency

**Why Validation Failed:**

The `case-study` schema has `industry` marked as **required: true**:
```json
"industry": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::industry.industry",
    "required": true
}
```

The seed logic in `src/index.ts` matches industries using:
```javascript
const relatedIndustry = allIndustries.find((ind: any) => 
    ind.title.includes(caseData.industry) || 
    ind.slug === caseData.industry.toLowerCase()
);
```

When no industry matches, `industry: undefined` fails Yup validation.

**Key Learnings:**

1. **Always validate mock data against master data** — Ensure relation field values in mock data match valid entries in master data
2. **Required relations cause validation failures** — If a relation is `required: true`, the referenced entity must exist
3. **Industry matching is by title with `.includes()`** — Partial matches work, but exact industry titles are safer for clarity
4. **Test seed data locally** — Run `npm run dev` and check bootstrap logs before committing mock data changes

---

### 2026-04-18 — Makefile & Production-Safe Seeding

**Task:** Create Makefile for backend and ensure seed data only runs in non-production environments.

**Changes Made:**

#### 1. Created `backend/Makefile`

| Target | Command | Description |
|--------|---------|-------------|
| `install` | `npm install` | Install dependencies |
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `clean` | `rm -rf node_modules .tmp dist` | Remove build artifacts |
| `db-reset` | `rm -rf .tmp data.db` | Reset database (deletes all data) |
| `db-seed` | `NODE_ENV=development npm run dev` | Run seed (forces dev mode) |
| `db-fresh` | `db-reset` + `db-seed` | Fresh start |
| `console` | `npm run console` | Strapi interactive REPL |
| `upgrade` | `npx @strapi/upgrade latest` | Upgrade Strapi |
| `help` | — | Show available commands |

**Usage:** `cd backend && make help`

#### 2. Updated `backend/src/index.ts` — Production-Safe Seeding

**Previous behavior:**
- Master data seeded **always** on bootstrap
- Mock data seeded only when `NODE_ENV=development`

**New behavior:**
- **ALL seeding** (master + mock) is blocked when `NODE_ENV === 'production'`
- Logs a warning if seeding is skipped due to production
- Permissions, optimization indexes, and repair operations still run in all environments

**Code structure:**
```typescript
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    console.warn('[SEED] ⚠️ SKIPPING ALL SEED OPERATIONS — Production environment detected');
    console.warn('[SEED] To seed data, run: NODE_ENV=development npm run dev');
} else {
    console.log('[SEED] ✓ Non-production environment — seeding enabled');
    // ... all seeding operations
}
```

**Key Learnings:**

1. **Explicit production check** — Use `NODE_ENV === 'production'` for critical safeguards, not just `!== 'development'` (handles edge cases like `test`, undefined, etc.)
2. **Log when skipping** — Always log why an operation is skipped so operators understand the behavior
3. **Provide recovery instructions** — Tell users how to seed if they need to: `NODE_ENV=development npm run dev`
4. **Separate seeding from syncing** — Sync operations (Media URL, Relation Denormalization) should still run in production; only creation of new seed data should be blocked
5. **Makefile targets for database ops** — `db-reset`, `db-seed`, `db-fresh` are essential for developer workflow

---

### 2026-04-19 — Seed System Deep Dive & Dual Approach

**Request from Aaron:** Clarify seed data categories and provide alternative seeding approach.

#### Question 1: Seed Data Categories Analysis

**Aaron's clarification:** "La seed data para no-prod es tema de: clients, authors, testimonials. En produccion esta data no es compartida y debe crearse manualmente."

**Data Categories:**

| Category | Data Type | Seed in Dev? | Seed in Prod? | Why? |
|----------|-----------|--------------|---------------|------|
| **Structural** | services, social-links, company-info, sectors, industries, pages | ✅ | ❌ | Static business structure, but controlled via admin |
| **Relationship** | clients, authors, testimonials | ✅ | ❌ | REAL data in prod — manual curation required |
| **Mock** | blog-posts, case-studies | ✅ | ❌ | Test content only |

**Why clients/authors/testimonials are NON-PRODUCTION ONLY:**

1. **Clients** — In production, client logos represent REAL business relationships. Requires explicit permission from each client. Created as contracts are signed.
2. **Authors** — In production, authors are REAL employees. Creating fake author profiles would be misleading.
3. **Testimonials** — In production, testimonials are REAL customer feedback. Fake testimonials are fraud/misrepresentation.

**Changes Made:**
- Added comprehensive JSDoc comments to `master-data.ts` explaining data categories
- Added function-level comments to `seedClients()`, `seedAuthors()`, `seedTestimonials()` explaining WHY they're non-production only
- Categorized seed operations in the main function with visual section dividers

#### Question 2: Bootstrap vs Make Script Analysis

**Aaron's question:** "Porque el seed process esta dentro del lifecycle del bootstrap de strapi? esto debe ser asi si o si? o podria hacerse mediante un script y comando de make?"

**Analysis:**

| Approach | Pros | Cons |
|----------|------|------|
| **A) Bootstrap (current)** | Automatic, no extra steps | Less control, seeds on every restart |
| **B) Make Script (new)** | Manual control, CI/CD friendly, selective seeding | Extra step required |

**Answer:** Seeding does NOT have to be in bootstrap. It's a design choice for convenience.

**Implemented Dual Approach:**

**Approach A — Automatic (default):**
- Seeding runs during Strapi bootstrap
- No configuration needed
- Current behavior maintained

**Approach B — Manual via Make commands:**
- Set `SKIP_SEED=true` to disable automatic seeding
- Use standalone commands for control

**New Files & Changes:**

1. **`backend/scripts/seed.ts`** — Standalone seed script
   - Can run independently of Strapi bootstrap
   - Uses `createStrapi().load()` for DB access without starting server
   - Supports flags: `--mock`, `--mock-only`, `--both`

2. **`backend/src/bootstrap/index.ts`** — Added SKIP_SEED support
   - New env var: `SKIP_SEED=true` skips all seeding
   - Re-exports `seedMasterData`, `seedMockData` for standalone script

3. **`backend/Makefile`** — New seed commands

| Target | Description |
|--------|-------------|
| `make seed` | Run master data seed only |
| `make seed-dev` | Run master + mock data seed |
| `make seed-mock` | Run mock data only |
| `make seed-all` | Alias for seed-dev |
| `make dev-no-seed` | Start dev with SKIP_SEED=true |
| `make dev-fresh` | Reset DB + start dev (auto-seeds) |
| `make db-fresh` | Reset + seed-all (updated) |

**Recommended Workflows:**

**Workflow 1 — Automatic (simple dev):**
```bash
make dev           # Starts Strapi, auto-seeds on bootstrap
```

**Workflow 2 — Manual (CI/CD, controlled):**
```bash
make db-reset      # Clear database
make seed          # Seed master data
make seed-dev      # Or include mock data
make dev-no-seed   # Start without re-seeding
```

**Workflow 3 — Fresh Start:**
```bash
make db-fresh      # Reset + seed-all in one command
```

**Key Learnings:**

1. **Bootstrap seeding is optional** — Strapi doesn't require seeding in bootstrap; it's a developer convenience
2. **SKIP_SEED pattern** — Simple env var gives control without code changes
3. **Standalone scripts need `createStrapi().load()`** — Full Strapi instance for DB access without starting HTTP server
4. **Dual approach is best** — Support both automatic (simple) and manual (controlled) workflows
5. **Re-export functions** — Exporting seed functions from `bootstrap/index.ts` allows standalone script to reuse them
