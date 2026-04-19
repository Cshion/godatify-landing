# Datify Landing Page — Documentación del Proyecto

> Landing page corporativa para Datify, empresa de consultoría de datos.

**Última actualización:** 2026-04-18  
**Documentado por:** Ripley (Lead)

---

## Resumen del Proyecto

**Datify** es una landing page corporativa bilingüe (español) que presenta servicios de consultoría en datos, casos de éxito, blog e información de industrias. El proyecto utiliza una arquitectura headless CMS con:

- **Frontend:** Next.js 16 con React 19 y TailwindCSS 4
- **Backend:** Strapi 5 como CMS headless con GraphQL

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Hosting)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Next.js 16 App                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │  │
│  │  │ App Router  │  │  Components  │  │   API Routes    │   │  │
│  │  │  /app/*     │  │  /components │  │   /actions/*    │   │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘   │  │
│  │                          │                                 │  │
│  │                    ┌─────▼─────┐                          │  │
│  │                    │  /lib/    │                          │  │
│  │                    │  api.ts   │                          │  │
│  │                    └───────────┘                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                       fetch() / REST
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRAPI 5 CMS (Backend)                       │
│  ┌─────────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Content Types  │  │   GraphQL   │  │    REST API      │    │
│  │  /api/*         │  │   Plugin    │  │   /api/*         │    │
│  └─────────────────┘  └─────────────┘  └──────────────────┘    │
│                              │                                  │
│            ┌─────────────────┼─────────────────┐               │
│            ▼                 ▼                 ▼               │
│     ┌──────────┐      ┌───────────┐     ┌──────────┐          │
│     │ SQLite   │      │ PostgreSQL│     │  AWS S3  │          │
│     │  (dev)   │      │  (prod)   │     │ (uploads)│          │
│     └──────────┘      └───────────┘     └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estructura de Directorios

```
godatify-landing/
├── .squad/                    # 🤖 Squad team configuration
│   ├── agents/                # Agent charters
│   ├── team.md                # Team roster
│   └── routing.md             # Work routing rules
│
├── frontend/                  # 🌐 Next.js Application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Home (/)
│   │   │   ├── blog/          # Blog (/blog)
│   │   │   ├── casos/         # Cases (/casos)
│   │   │   ├── contacto/      # Contact (/contacto)
│   │   │   ├── industrias/    # Industries (/industrias)
│   │   │   ├── nosotros/      # About (/nosotros)
│   │   │   ├── servicios/     # Services (/servicios)
│   │   │   └── actions/       # Server actions
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── sections/      # Hero, Services, Cases, etc.
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── [page]/        # Page-specific components
│   │   │
│   │   ├── data/              # Fallback static data
│   │   ├── lib/               # Utilities (api.ts, seo.ts)
│   │   └── types/             # TypeScript definitions
│   │
│   ├── public/images/         # Static images
│   └── package.json
│
└── backend/                   # 📦 Strapi CMS
    ├── src/
    │   ├── api/               # Content type APIs
    │   │   ├── service/       # Services CRUD
    │   │   ├── case-study/    # Case Studies CRUD
    │   │   ├── blog-post/     # Blog Posts CRUD
    │   │   ├── industry/      # Industries CRUD
    │   │   ├── sector/        # Sectors CRUD
    │   │   ├── testimonial/   # Testimonials CRUD
    │   │   ├── client/        # Clients CRUD
    │   │   ├── author/        # Authors CRUD
    │   │   ├── social-link/   # Social links CRUD
    │   │   ├── company-info/  # Company info (single)
    │   │   ├── home-page/     # Home page config (single)
    │   │   ├── about-page/    # About page config (single)
    │   │   ├── contact-page/  # Contact page config (single)
    │   │   └── industries-page/ # Industries page (single)
    │   │
    │   └── extensions/        # Strapi extensions
    │
    ├── config/                # Strapi configuration
    │   ├── database.ts        # DB config (SQLite/PostgreSQL)
    │   ├── plugins.ts         # GraphQL, AWS S3 config
    │   └── server.ts          # Server config
    │
    ├── seed-data/             # Seed data for dev
    │   ├── master/            # Production seed data
    │   └── mock/              # Development mock data
    │
    └── types/generated/       # Auto-generated TypeScript types
```

---

## Configuración del Entorno

### Variables de Entorno — Backend (`backend/.env`)

```env
# Servidor
HOST=0.0.0.0
PORT=1337

# Claves de seguridad (generar con `openssl rand -base64 32`)
APP_KEYS=key1,key2
API_TOKEN_SALT=random_salt
ADMIN_JWT_SECRET=random_secret
TRANSFER_TOKEN_SALT=random_salt
JWT_SECRET=random_secret
ENCRYPTION_KEY=random_key

# Base de datos (producción)
DATABASE_CLIENT=postgres           # 'sqlite' para desarrollo
DATABASE_URL=postgres://...        # Solo para PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=password
DATABASE_SSL=false

# AWS S3 (producción)
DISABLE_S3=true                    # true en desarrollo
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET=your_bucket
```

### Variables de Entorno — Frontend (`frontend/.env.local`)

```env
# Strapi URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## Comandos

### Frontend (Next.js)

```bash
cd frontend

npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo (http://localhost:3000)
npm run build        # Build de producción
npm run start        # Iniciar producción
npm run lint         # Verificar ESLint
```

### Backend (Strapi)

```bash
cd backend

npm install          # Instalar dependencias
npm run develop      # Servidor con auto-reload (http://localhost:1337)
npm run build        # Build del admin panel
npm run start        # Servidor sin auto-reload (producción)
npm run upgrade      # Actualizar Strapi
```

---

## Setup desde Cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/godatify-landing.git
cd godatify-landing
```

### 2. Configurar Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus valores de seguridad
npm install
npm run develop
```

Esto abrirá el admin de Strapi en `http://localhost:1337/admin`. Crear usuario admin.

### 3. Configurar Frontend

```bash
cd ../frontend
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" > .env.local
npm install
npm run dev
```

Frontend disponible en `http://localhost:3000`.

### 4. Cargar datos de prueba (opcional)

Los archivos en `backend/seed-data/` contienen datos de ejemplo. Importarlos manualmente desde el admin de Strapi o crear un script de seed.

---

## Content Types en Strapi

### Collection Types (múltiples entradas)

| Tipo | Endpoint | Descripción |
|------|----------|-------------|
| **Service** | `/api/services` | Servicios ofrecidos |
| **Case Study** | `/api/case-studies` | Casos de éxito |
| **Blog Post** | `/api/blog-posts` | Artículos del blog |
| **Industry** | `/api/industries` | Industrias atendidas |
| **Sector** | `/api/sectors` | Categorías de industrias |
| **Client** | `/api/clients` | Clientes corporativos |
| **Testimonial** | `/api/testimonials` | Testimonios |
| **Author** | `/api/authors` | Autores del blog |
| **Social Link** | `/api/social-links` | Redes sociales |

### Single Types (una sola entrada)

| Tipo | Endpoint | Descripción |
|------|----------|-------------|
| **Company Info** | `/api/company-info` | Información de la empresa |
| **Home Page** | `/api/home-page` | Configuración de home |
| **About Page** | `/api/about-page` | Configuración de nosotros |
| **Contact Page** | `/api/contact-page` | Configuración de contacto |
| **Industries Page** | `/api/industries-page` | Configuración de industrias |

### Relaciones Clave

```
Sector ──┬── Industry ──┬── Case Study
         │              │
         │              └── Service (M:N)
         │
Client ──┴── Case Study ──── Testimonial
                        │
Author ─────── Blog Post ───┘
```

---

## Endpoints API Principales

### Servicios
```
GET  /api/services                    # Lista todos
GET  /api/services/:id                # Detalle por ID
GET  /api/services?filters[slug]=x    # Buscar por slug
```

### Casos de Éxito
```
GET  /api/case-studies?populate=*     # Lista con relaciones
GET  /api/case-studies/:slug          # Detalle por slug
```

### Blog
```
GET  /api/blog-posts?sort=date:desc   # Lista ordenada
GET  /api/blog-posts/:slug            # Detalle por slug
```

### GraphQL (opcional)
```
POST /graphql                         # Queries GraphQL
```

Ejemplo de query:
```graphql
query {
  services {
    title
    slug
    description
  }
}
```

---

## Rutas del Frontend

| Ruta | Página | Componente |
|------|--------|------------|
| `/` | Home | `app/page.tsx` |
| `/servicios` | Servicios | `app/servicios/page.tsx` |
| `/servicios/[slug]` | Servicio detalle | `app/servicios/[slug]/page.tsx` |
| `/casos` | Casos de éxito | `app/casos/page.tsx` |
| `/casos/[slug]` | Caso detalle | `app/casos/[slug]/page.tsx` |
| `/industrias` | Industrias | `app/industrias/page.tsx` |
| `/industrias/[slug]` | Industria detalle | `app/industrias/[slug]/page.tsx` |
| `/blog` | Blog | `app/blog/page.tsx` |
| `/blog/[slug]` | Artículo | `app/blog/[slug]/page.tsx` |
| `/nosotros` | Nosotros | `app/nosotros/page.tsx` |
| `/contacto` | Contacto | `app/contacto/page.tsx` |

---

## Deploy

### Frontend (Vercel)

```bash
cd frontend
vercel login
vercel                 # Preview deploy
vercel --prod          # Production deploy
```

Configurar variable `NEXT_PUBLIC_STRAPI_URL` en Vercel Dashboard.

### Backend (Strapi Cloud / Railway / Render)

1. Configurar PostgreSQL en producción
2. Configurar AWS S3 para uploads
3. Establecer todas las variables de entorno
4. Deploy con `npm run build && npm run start`

---

## Stack Tecnológico Detallado

### Frontend
- **Next.js 16.0.7** — Framework React con App Router
- **React 19.2.0** — UI Library
- **TailwindCSS 4** — Utility-first CSS
- **TypeScript 5** — Type safety
- **@strapi/blocks-react-renderer** — Renderizar Strapi rich text

### Backend
- **Strapi 5.31.3** — Headless CMS
- **@strapi/plugin-graphql** — API GraphQL
- **better-sqlite3** — SQLite para desarrollo
- **pg** — PostgreSQL para producción
- **@strapi/provider-upload-aws-s3** — Uploads a S3
- **sharp** — Optimización de imágenes

### Infraestructura
- **Vercel** — Hosting frontend
- **PostgreSQL** — Base de datos producción
- **AWS S3** — Storage de media

---

## Notas para el Equipo

### Convenciones de Código

1. **Español** para contenido visible al usuario
2. **Inglés** para código (variables, funciones, comentarios técnicos)
3. **Kebab-case** para slugs y rutas
4. **PascalCase** para componentes React
5. **camelCase** para funciones y variables

### Fallback Data

El frontend tiene datos de fallback en `src/data/` por si Strapi no está disponible. Útil para desarrollo frontend independiente.

### Caché

Actualmente `cache: 'no-store'` en fetches. Considerar implementar ISR o cache tags para producción.

---

*Documentación generada por Ripley (Lead) — Squad Team*
