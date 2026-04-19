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

### Custom Logic (`src/index.ts`)

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
