# Deployment Guide — godatify-landing

Production deployment using **Vercel (Frontend)** + **Cloudflare (CDN/DNS)** + **EC2 (Backend)**.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend (Vercel)](#frontend-vercel)
3. [Backend (EC2 + PM2)](#backend-ec2--pm2)
4. [Cloudflare Configuration](#cloudflare-configuration)
5. [Environment Variables](#environment-variables)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Internet                                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Cloudflare (CDN + DNS)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  • DDoS Protection          • Edge Caching                          │   │
│  │  • SSL/TLS (Full Strict)    • Page Rules                            │   │
│  │  • WAF                       • Analytics                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────┬───────────────────┘
                  │                                       │
                  ▼                                       ▼
┌─────────────────────────────────────┐   ┌───────────────────────────────────┐
│        Vercel (Frontend)            │   │        AWS EC2 (Backend)          │
│  ┌───────────────────────────────┐  │   │  ┌─────────────────────────────┐  │
│  │      Next.js Application      │  │   │  │    Nginx (SSL + Proxy)      │  │
│  │  • Edge Functions             │  │   │  └─────────────┬───────────────┘  │
│  │  • Automatic Deployments      │  │   │                │                  │
│  │  • Preview URLs               │  │   │                ▼                  │
│  │  • Global Edge Network        │  │   │  ┌─────────────────────────────┐  │
│  └───────────────────────────────┘  │   │  │  PM2 (Strapi Cluster)       │  │
│                                     │   │  └─────────────┬───────────────┘  │
│  godatify.com ──► Vercel           │   │                │                  │
└─────────────────────────────────────┘   │                ▼                  │
                                          │  ┌─────────────────────────────┐  │
                                          │  │      PostgreSQL             │  │
                                          │  └─────────────────────────────┘  │
                                          │                                   │
                                          │  api.godatify.com ──► EC2        │
                                          └───────────────────────────────────┘
\`\`\`

### Why This Stack?

| Component | Platform | Benefits |
|-----------|----------|----------|
| Frontend | Vercel | Zero-config Next.js, edge functions, automatic preview deployments, global CDN |
| CDN/DNS | Cloudflare | DDoS protection, edge caching, WAF, analytics, free SSL |
| Backend | EC2 + PM2 | Full control, persistent database, cost-effective for Strapi CMS |

---

## Frontend (Vercel)

### Initial Setup

1. **Connect to Vercel:**
   \`\`\`bash
   cd frontend
   npx vercel login
   npx vercel link
   \`\`\`

2. **Configure Project Settings:**
   - Framework Preset: Next.js
   - Build Command: \`npm run build\`
   - Output Directory: \`.next\`
   - Install Command: \`npm install\`

### Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| \`NEXT_PUBLIC_API_URL\` | \`https://api.godatify.com\` | Production |
| \`NEXT_PUBLIC_API_URL\` | \`https://staging-api.godatify.com\` | Preview |
| \`NEXT_PUBLIC_SITE_URL\` | \`https://godatify.com\` | Production |

### Deployment

**Automatic Deployments:**
- Push to \`main\` → Production deployment
- Push to any branch → Preview deployment with unique URL

**Manual Deployment:**
\`\`\`bash
cd frontend
npx vercel --prod  # Production
npx vercel         # Preview
\`\`\`

### vercel.json Configuration

The \`frontend/vercel.json\` includes:
- Security headers (HSTS, CSP, XSS protection)
- API route rewrites to backend
- Cache control for static assets
- Region configuration for optimal latency

---

## Backend (EC2 + PM2)

The Strapi backend remains on EC2 for database persistence and full server control.

### Quick Setup

\`\`\`bash
# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2-IP>

# Clone and setup
git clone <repo-url> /var/www/godatify
cd /var/www/godatify
bash scripts/setup-ec2.sh

# Configure environment
cp backend/.env.example backend/.env
nano backend/.env

# Deploy
bash scripts/deploy.sh
\`\`\`

### EC2 Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Instance | t3.small | t3.medium |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB | 50 GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |

### PM2 Commands

\`\`\`bash
# Status
pm2 status

# Logs
pm2 logs strapi

# Restart
pm2 reload ecosystem.config.js

# Monitor
pm2 monit
\`\`\`

### Connecting Frontend to Backend

The frontend calls the backend API via \`NEXT_PUBLIC_API_URL\`:

\`\`\`typescript
// frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
\`\`\`

**CORS Configuration** in Strapi (\`backend/config/middlewares.ts\`):
\`\`\`typescript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: [
      'https://godatify.com',
      'https://www.godatify.com',
      'https://*.vercel.app',  // Preview deployments
    ],
  },
},
\`\`\`

---

## Cloudflare Configuration

Cloudflare sits in front of both Vercel and EC2, providing:
- **DDoS Protection** — Automatic attack mitigation
- **Edge Caching** — Faster response times globally
- **SSL/TLS** — End-to-end encryption
- **WAF** — Web Application Firewall

### DNS Setup

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | \`@\` | \`cname.vercel-dns.com\` | ✅ Proxied |
| CNAME | \`www\` | \`cname.vercel-dns.com\` | ✅ Proxied |
| A | \`api\` | \`<EC2-ELASTIC-IP>\` | ✅ Proxied |

### SSL/TLS Mode

Set to **Full (Strict)** in Cloudflare Dashboard:
- Cloudflare → SSL/TLS → Overview → Full (strict)

See \`docs/cloudflare-setup.md\` for detailed configuration steps.

---

## Environment Variables

### Vercel (Frontend)

Set in Vercel Dashboard → Settings → Environment Variables:

\`\`\`bash
# Production
NEXT_PUBLIC_API_URL=https://api.godatify.com
NEXT_PUBLIC_SITE_URL=https://godatify.com

# Preview (optional, for staging)
NEXT_PUBLIC_API_URL=https://staging-api.godatify.com
\`\`\`

### EC2 (Backend)

Create \`/var/www/godatify/backend/.env\`:

\`\`\`bash
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# URLs
PUBLIC_URL=https://api.godatify.com
FRONTEND_URL=https://godatify.com

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<secure-password>
DATABASE_SSL=false

# Security Keys (generate with: openssl rand -base64 32)
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<salt>
ADMIN_JWT_SECRET=<jwt-secret>
TRANSFER_TOKEN_SALT=<salt>
JWT_SECRET=<jwt-secret>

# AWS S3 (for uploads)
AWS_ACCESS_KEY_ID=<access-key>
AWS_ACCESS_SECRET=<secret-key>
AWS_REGION=us-east-1
AWS_BUCKET=godatify-uploads
\`\`\`

### GitHub Secrets

Required for CI/CD:

| Secret | Description |
|--------|-------------|
| \`VERCEL_TOKEN\` | Vercel API token |
| \`VERCEL_ORG_ID\` | Vercel organization ID |
| \`VERCEL_PROJECT_ID\` | Vercel project ID |
| \`EC2_HOST\` | EC2 public IP or domain |
| \`EC2_USER\` | SSH user (ubuntu) |
| \`EC2_SSH_KEY\` | Private SSH key |
| \`ENV_FILE\` | Base64-encoded .env |
| \`CLOUDFLARE_API_TOKEN\` | Cloudflare API token (optional) |
| \`CLOUDFLARE_ZONE_ID\` | Cloudflare zone ID (optional) |

---

## GitHub Actions CI/CD

The workflow (\`.github/workflows/deploy.yml\`) handles both deployments:

### Frontend → Vercel
- Triggered on changes to \`frontend/**\`
- Uses Vercel CLI for deployment
- Automatic preview deployments on PRs
- Production deployment on \`main\` branch

### Backend → EC2
- Triggered on changes to \`backend/**\`
- SSH deployment to EC2
- PM2 reload for zero-downtime

### Manual Triggers

\`\`\`bash
# Trigger via GitHub CLI
gh workflow run deploy.yml -f deploy_frontend=true -f deploy_backend=true
\`\`\`

---

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Add \`godatify.com\` and \`www.godatify.com\`
3. Vercel will show required DNS records

### 2. Configure Cloudflare DNS

Add CNAME records pointing to Vercel:
- \`@\` → \`cname.vercel-dns.com\` (Proxied)
- \`www\` → \`cname.vercel-dns.com\` (Proxied)

### 3. Verify in Vercel

Vercel will automatically detect the DNS and issue SSL.

### 4. API Subdomain

For \`api.godatify.com\`:
1. Add A record in Cloudflare pointing to EC2 IP
2. Ensure Nginx is configured with SSL (Let's Encrypt)
3. Cloudflare SSL mode: Full (strict)

---

## Monitoring & Troubleshooting

### Vercel

- **Deployments:** Vercel Dashboard → Deployments
- **Logs:** Vercel Dashboard → Logs (real-time)
- **Analytics:** Vercel Dashboard → Analytics

### Cloudflare

- **Traffic:** Cloudflare Dashboard → Analytics
- **Security Events:** Cloudflare → Security → Events
- **Cache Performance:** Cloudflare → Caching → Overview

### EC2/PM2

\`\`\`bash
# Application logs
pm2 logs strapi

# System resources
htop

# Health check
curl -I https://api.godatify.com/_health
\`\`\`

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check Strapi CORS config includes Vercel preview URLs |
| 522 errors | EC2 is down or firewall blocking Cloudflare IPs |
| SSL errors | Ensure Cloudflare SSL mode is "Full (strict)" |
| Cache issues | Purge Cloudflare cache: Dashboard → Caching → Purge |

---

## Summary

| Component | URL | Platform |
|-----------|-----|----------|
| Frontend | \`godatify.com\` | Vercel (via Cloudflare) |
| Backend API | \`api.godatify.com\` | EC2 (via Cloudflare) |
| Admin Panel | \`api.godatify.com/admin\` | EC2 |
| CDN/DNS | — | Cloudflare |

This architecture gives you the best of all worlds:
- **Vercel:** Automatic deployments, edge functions, preview URLs
- **Cloudflare:** Global CDN, DDoS protection, caching
- **EC2:** Full control over backend, persistent database
