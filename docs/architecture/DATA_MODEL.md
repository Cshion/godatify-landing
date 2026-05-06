# Data Model

All content types are managed by Strapi 5. The REST API is auto-generated per collection. Content lives in PostgreSQL.

---

## Content Type Index

| API Name | Kind | Description |
|---|---|---|
| `blog-post` | Collection | Blog articles and news |
| `author` | Collection | Blog post authors |
| `case-study` | Collection | Client case studies |
| `client` | Collection | Client logos and metadata |
| `testimonial` | Collection | Client testimonials |
| `industry` | Collection | Industry verticals |
| `sector` | Collection | Sectors within industries |
| `service` | Collection | Service offerings |
| `social-link` | Collection | Social media links |
| `company-info` | Single | Global company metadata |
| `home-page` | Single | Home page content config |
| `about-page` | Single | `/nosotros` page content |
| `blog-page` | Single | `/blog` page header/meta |
| `cases-page` | Single | `/casos` page header/meta |
| `contact-page` | Single | `/contacto` page content |
| `industries-page` | Single | `/industrias` page content |
| `contact-submission` | Collection | Form submissions (write-only) |

---

## Detailed Schemas

### `blog-post` (Collection)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | — |
| `slug` | uid (→ title) | ✅ | Auto-generated from title |
| `excerpt` | text | — | Short description |
| `content` | blocks | — | Rich text body (Strapi Blocks) |
| `coverImageUrl` | string | — | External image URL fallback |
| `coverImage` | media (single, images) | — | CMS-managed upload |
| `date` | date | — | Publication date |
| `readingTime` | string | — | e.g. "5 min read" |
| `featured` | boolean | — | Default: `false` |
| `author` | relation (manyToOne → `author`) | — | Inversed by `author.blog_posts` |
| `tags` | **json** | — | Array of tag strings, e.g. `["Data", "AWS"]` |

> **Note on `tags`:** Field type was changed from `text` → `json`. Frontend must parse as `string[]`. Do not treat as a comma-separated string.

Draft/Publish: **enabled**

---

### `author` (Collection)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Author full name |
| `role` | string | Job title / role |
| `avatarUrl` | string | Image URL |
| `blog_posts` | relation (oneToMany → `blog-post`) | Inverse of blog-post.author |

---

### `case-study` (Collection)

| Field | Type | Notes |
|---|---|---|
| `title` | string | Project title |
| `slug` | uid | URL identifier |
| `client` | string | Client name |
| `industry` | string | Industry label |
| `summary` | text | Short description |
| `content` | blocks | Full case study body |
| `coverImageUrl` | string | Hero image URL |
| `tags` | json | Technology tags |
| `featured` | boolean | — |

---

### `client` (Collection)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Company name |
| `logoUrl` | string | Logo image URL |
| `website` | string | Optional external link |
| `featured` | boolean | Show on home page |

---

### `testimonial` (Collection)

| Field | Type | Notes |
|---|---|---|
| `quote` | text | Testimonial body |
| `author` | string | Person's name |
| `role` | string | Job title |
| `company` | string | Company name |
| `avatarUrl` | string | Optional photo |
| `featured` | boolean | — |

---

### `industry` (Collection)

| Field | Type | Notes |
|---|---|---|
| `name` | string | e.g. "Cervecería", "Logística" |
| `slug` | uid | URL identifier |
| `description` | text | Industry description |
| `iconUrl` | string | Optional icon |
| `sectors` | relation (oneToMany → `sector`) | Sub-sectors |

---

### `sector` (Collection)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Sector name |
| `description` | text | — |
| `industry` | relation (manyToOne → `industry`) | Parent industry |

---

### `service` (Collection)

| Field | Type | Notes |
|---|---|---|
| `title` | string | Service name |
| `slug` | uid | URL identifier |
| `description` | text | Short description |
| `content` | blocks | Full service detail |
| `iconUrl` | string | Optional icon |
| `featured` | boolean | Show on home page |

---

### `social-link` (Collection)

| Field | Type | Notes |
|---|---|---|
| `platform` | string | e.g. "LinkedIn", "Twitter" |
| `url` | string | Full URL |
| `icon` | string | FontAwesome identifier |

---

### `company-info` (Single Type)

Global metadata for the company. Shared across all pages.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Company display name |
| `tagline` | string | — |
| `email` | string | Contact email |
| `phone` | string | — |
| `address` | text | — |
| `description` | text | About summary |

---

### Page Single Types

Each page single type (`home-page`, `about-page`, `blog-page`, `cases-page`, `contact-page`, `industries-page`) contains:
- Section labels (titles, button text, subtitles)
- Page-level SEO metadata (title, description, OG image)
- Layout configuration (carousel settings, video config, stats)

---

## Seed Data Strategy

| Category | Location | Purpose |
|---|---|---|
| **Master** | `backend/seed-data/master/` | Canonical content — company info, pages, industries, sectors, services, social links |
| **Mock** | `backend/seed-data/mock/` | Demo content — authors, blog posts, case studies, clients, testimonials |

Master data is seeded on every bootstrap in production. Mock data is only seeded in development (`NODE_ENV !== production`).

Seed scripts: `backend/scripts/seed.ts`, `backend/scripts/reset.ts`  
Bootstrap entry: `backend/src/bootstrap/index.ts`
